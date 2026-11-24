import { chromium } from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>console.log('PAGE ERROR',e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('localhost'))console.log('HTTP ERROR',r.status(),r.url());});
const response=await page.goto('http://localhost/portofolio_indra/',{waitUntil:'networkidle'});console.log('HTTP',response.status(),page.url());await page.waitForTimeout(2300);
console.log(await page.evaluate(()=>({title:document.title,body:document.body.innerText.slice(0,350),overflow:document.documentElement.scrollWidth-innerWidth,runtime:window.__PORTFOLIO__?{base:window.__PORTFOLIO__.baseUrl,mail:window.__PORTFOLIO__.mailEnabled}:null})));
await page.screenshot({path:'.qa/laravel-desktop.png'});
for(const id of ['about','portfolio','contact']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:'.qa/laravel-'+id+'.png'});}
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost/portofolio_indra/public/');await page.waitForTimeout(1700);await page.screenshot({path:'.qa/laravel-mobile.png',fullPage:true});
await browser.close();
