<?php
/**
 * Dynamic Sitemap Generator for fahadalnoman.com
 * 
 * Fetches published blog posts from admin.zurvix.com API (PostgreSQL)
 * so the sitemap auto-updates whenever blogs are created, updated, or deleted.
 * 
 * Accessed via: https://fahadalnoman.com/sitemap.xml
 * (.htaccess rewrites sitemap.xml → sitemap.php)
 */

// Redirect direct sitemap.php access to canonical sitemap.xml URL
if (strpos($_SERVER['REQUEST_URI'], 'sitemap.php') !== false) {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: https://fahadalnoman.com/sitemap.xml");
    exit();
}

header("Content-Type: application/xml; charset=utf-8");

// Cache the sitemap for 1 hour to avoid hammering the API on every crawl
$cacheFile = sys_get_temp_dir() . '/fahadalnoman_sitemap_cache.xml';
$cacheExpiry = 3600; // 1 hour

if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheExpiry) {
    readfile($cacheFile);
    exit();
}

// Build the sitemap XML
$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// ─── Static Pages ───────────────────────────────────────────────────────────
$staticPages = [
    ['loc' => '/',        'changefreq' => 'monthly', 'priority' => '1.0'],
    ['loc' => '/about',   'changefreq' => 'monthly', 'priority' => '0.9'],
    ['loc' => '/services','changefreq' => 'monthly', 'priority' => '0.9'],
    ['loc' => '/contact', 'changefreq' => 'monthly', 'priority' => '0.8'],
    ['loc' => '/blog',    'changefreq' => 'daily',   'priority' => '0.9'],
    ['loc' => '/sitemap', 'changefreq' => 'monthly', 'priority' => '0.4'],
    ['loc' => '/terms',   'changefreq' => 'yearly',  'priority' => '0.3'],
    ['loc' => '/privacy', 'changefreq' => 'yearly',  'priority' => '0.3'],
];

foreach ($staticPages as $page) {
    $xml .= "  <url>\n";
    $xml .= "    <loc>https://fahadalnoman.com" . htmlspecialchars($page['loc']) . "</loc>\n";
    $xml .= "    <changefreq>" . $page['changefreq'] . "</changefreq>\n";
    $xml .= "    <priority>" . $page['priority'] . "</priority>\n";
    $xml .= "  </url>\n";
}

// ─── Dynamic Blog Posts (from admin.zurvix.com API) ─────────────────────────
try {
    $apiUrl = 'https://admin.zurvix.com/api/posts';
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Accept: application/json\r\nUser-Agent: FahadAlNoman-SitemapGenerator/1.0\r\n",
            'timeout' => 10,
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);
    
    $response = @file_get_contents($apiUrl, false, $context);
    
    if ($response !== false) {
        $posts = json_decode($response, true);
        
        if (is_array($posts)) {
            foreach ($posts as $post) {
                // Only include published posts
                $status = $post['status'] ?? '';
                if ($status !== 'published') continue;
                
                $slug = htmlspecialchars($post['slug'] ?? '');
                if (empty($slug)) continue;
                
                // Use updated_at for lastmod, fallback to date/created_at
                $lastmod = '';
                if (!empty($post['updated_at'])) {
                    $lastmod = substr($post['updated_at'], 0, 10);
                } elseif (!empty($post['date'])) {
                    $lastmod = substr($post['date'], 0, 10);
                } elseif (!empty($post['created_at'])) {
                    $lastmod = substr($post['created_at'], 0, 10);
                }
                
                $xml .= "  <url>\n";
                $xml .= "    <loc>https://fahadalnoman.com/blog/" . $slug . "</loc>\n";
                if ($lastmod) {
                    $xml .= "    <lastmod>" . htmlspecialchars($lastmod) . "</lastmod>\n";
                }
                $xml .= "    <changefreq>weekly</changefreq>\n";
                $xml .= "    <priority>0.8</priority>\n";
                $xml .= "  </url>\n";
            }
        }
    }
} catch (\Exception $e) {
    // Fail silently — static pages still appear in sitemap
    error_log("Sitemap blog fetch error: " . $e->getMessage());
}

// ─── Dynamic Blog Categories ────────────────────────────────────────────────
try {
    $catUrl = 'https://admin.zurvix.com/api/categories';
    $catResponse = @file_get_contents($catUrl, false, $context);
    
    if ($catResponse !== false) {
        $categories = json_decode($catResponse, true);
        
        if (is_array($categories)) {
            foreach ($categories as $cat) {
                $catSlug = htmlspecialchars($cat['slug'] ?? '');
                if (empty($catSlug)) continue;
                
                $xml .= "  <url>\n";
                $xml .= "    <loc>https://fahadalnoman.com/blog/category/" . $catSlug . "</loc>\n";
                $xml .= "    <changefreq>weekly</changefreq>\n";
                $xml .= "    <priority>0.6</priority>\n";
                $xml .= "  </url>\n";
            }
        }
    }
} catch (\Exception $e) {
    error_log("Sitemap category fetch error: " . $e->getMessage());
}

$xml .= "</urlset>\n";

// Write cache and output
@file_put_contents($cacheFile, $xml);
echo $xml;
