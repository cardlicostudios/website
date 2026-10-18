import {renderPage} from '../scripts/templates.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('homepage has one store group, five boards and distinct rule heading',()=>{
 const html=renderPage(readFileSync('index.html','utf8'));
 assert(html.includes('Four suits. Four directions.'));
 for(const board of ['Relaxed','Normal','Hard','Expert','Memory'])assert(html.includes(board));
 assert.equal((html.match(/data-store="play"/g)||[]).length,1);
 assert.equal((html.match(/class="mode-icon"><svg/g)||[]).length,3);
 assert(html.includes('Join the App Store waitlist'));
 assert(html.includes('Get Cardlico on Google Play'));
 assert(html.includes('https://x.com/cardlico'));
 assert(html.includes('https://www.instagram.com/cardlico/'));
 assert(html.includes('https://www.tiktok.com/@cardlico'));
 assert(html.includes('https://www.youtube.com/@cardlico'));
 assert(html.includes('name="pinterest-site-verification"'));
 assert(html.includes('content="572517eeb0921f7d2417fd5607b77c19"'));
 assert(html.includes('id="support"'));
 assert(html.includes('Support Cardlico your way'));
 assert(html.includes('Upgrade to Premium'));
 assert(html.includes('first three Campaign levels'));
 assert(html.indexOf('home-boards') < html.indexOf('id="support"'));
 assert(html.indexOf('id="support"') < html.indexOf('id="download-cta"'));
 const heroEnd = html.indexOf('</header>');
 assert(heroEnd > 0);
 assert(html.indexOf('Support Cardlico your way') > heroEnd);
});

test('Play Store is released and App Store stays coming soon',()=>{
 const config=readFileSync('site-config.js','utf8');
 assert(config.includes("state: 'released'"));
 assert(config.includes('https://play.google.com/store/apps/details?id=com.cardlico.app'));
 assert(config.includes("ios: { state: 'coming-soon', url: '' }"));
});
