import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  console.log('Navigating to https://remnara.com/...');
  await page.goto('https://remnara.com/', { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForTimeout(3000);

  const title = await page.title();
  console.log('Page Title:', title);

  // Extract headings, navigation, buttons, and links
  const analysis = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map((h) => ({
      tag: h.tagName,
      text: h.textContent?.trim(),
    }));

    const links = Array.from(document.querySelectorAll('a')).map((a) => ({
      text: a.textContent?.trim(),
      href: a.href,
      target: a.target,
    }));

    const buttons = Array.from(document.querySelectorAll('button')).map((b) => b.textContent?.trim());

    const badges = Array.from(document.querySelectorAll('[class*="badge"], [class*="chip"], [class*="tag"], [class*="pill"]')).map((b) => b.textContent?.trim());

    // Get body text summary
    const bodyText = document.body.innerText;

    return {
      headings,
      links: links.filter((l) => l.text || l.href),
      buttons: buttons.filter(Boolean),
      badges: badges.filter(Boolean),
      bodyLength: bodyText.length,
      sampleText: bodyText.slice(0, 1500),
    };
  });

  console.log('\n--- HEADINGS ---');
  console.log(JSON.stringify(analysis.headings, null, 2));

  console.log('\n--- LINKS & EXPLORER TARGETS ---');
  console.log(JSON.stringify(analysis.links, null, 2));

  console.log('\n--- BUTTONS / CTAS ---');
  console.log(JSON.stringify(analysis.buttons, null, 2));

  console.log('\n--- BADGES / CHIPS ---');
  console.log(JSON.stringify(analysis.badges, null, 2));

  console.log('\n--- SAMPLE BODY TEXT ---');
  console.log(analysis.sampleText);

  await browser.close();
}

main().catch(console.error);
