import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";

type Product = {
  title: string,
  image: string | undefined,
  link: string,
  price: string,
  reviews?: string,
  stars?: string,
};
const fetchShelves = async () => {
  try {
    const url = 'https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=shelves&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309';
    const res = await fetch(url);
    // const body = new Uint8Array(await res.arrayBuffer());
    const html = await res.text()
    // console.log(html)
    const $ = cheerio.load(html)
    const shelves: Product[] = [];

    $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
            const shelf = $(el)
            const title = shelf.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
            const image = shelf.find('img.s-image').attr('src')
            const link = shelf.find('a.a-link-normal.a-text-normal').attr('href')
            const reviews = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small').children('span').last().attr('aria-label')
            const stars = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span').attr('aria-label')
            const price = shelf.find('span.a-price > span.a-offscreen').text()
            let element: Product = {
              title,
              image: image,
              link: `https://amazon.com${link}`,
              price,
            }
 
            if (reviews) {
              element.reviews = reviews
            }
 
            if (stars) {
              element.stars = stars
            }
 
            shelves.push(element)
        });
    
        return shelves;
  } catch (error) {
    throw error;
  }
}

fetchShelves().then((shelves) => console.log(shelves));
