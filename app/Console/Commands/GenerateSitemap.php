<?php

namespace App\Console\Commands;

use App\Services\SitemapGenerator;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate the public sitemap.xml file';

    public function handle(SitemapGenerator $generator): int
    {
        $generator->generate();
        $this->info('Sitemap generated at public/sitemap.xml');

        return self::SUCCESS;
    }
}
