import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://kanohagoods.com/shop/page/{}/"
IMAGE_DIR = "/home/ubuntu/kanoha-import/client/public/images/products/"
DATA_FILE = "/home/ubuntu/kanoha-import/client/src/data/products.json"

# Ensure directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

products = []
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
}

# Setup session with retries
session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)
session.headers.update(headers)

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).replace(" ", "_")

def download_image(url, filename):
    if not url: return "/images/products/placeholder.webp"
    
    # Check if file already exists to avoid re-downloading
    local_path = os.path.join(IMAGE_DIR, filename)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return f"/images/products/{filename}"

    try:
        response = session.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return f"/images/products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return "/images/products/placeholder.webp"

# Try scraping first 5 pages for now to ensure success
total_pages = 5 
print(f"Starting scrape of {total_pages} pages...")

for page in range(1, total_pages + 1):
    print(f"Scraping page {page}/{total_pages}...")
    try:
        response = session.get(BASE_URL.format(page), timeout=15)
        if response.status_code != 200:
            print(f"Failed to load page {page}: Status {response.status_code}")
            continue
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try multiple selectors for products
        items = soup.select('.product') or soup.select('li.product') or soup.select('.type-product')
        
        print(f"Found {len(items)} items on page {page}")

        for item in items:
            try:
                name_el = item.select_one('.woocommerce-loop-product__title') or item.select_one('h2')
                price_el = item.select_one('.price')
                img_el = item.select_one('img')
                
                if name_el:
                    name = name_el.text.strip()
                    price = price_el.text.strip() if price_el else "Contact for Price"
                    
                    img_url = None
                    if img_el:
                        img_url = img_el.get('data-src') or img_el.get('src')
                        # Try to get largest image from srcset
                        if img_el.get('srcset'):
                            srcset = img_el.get('srcset').split(',')
                            # Get the last one (usually largest)
                            img_url = srcset[-1].strip().split(' ')[0]
                    
                    # Generate filename
                    product_id = str(len(products) + 1)
                    img_ext = "jpg"
                    if img_url:
                        ext_match = img_url.split('.')[-1].split('?')[0]
                        if len(ext_match) <= 4: img_ext = ext_match
                    
                    img_filename = f"{product_id}_{clean_filename(name)[:30]}.{img_ext}"
                    
                    local_img_path = download_image(img_url, img_filename)
                    
                    # Category extraction
                    classes = item.get('class', [])
                    categories = [c.replace('product_cat-', '') for c in classes if c.startswith('product_cat-')]
                    category = categories[0].replace('-', ' ').title() if categories else "General"

                    products.append({
                        "id": product_id,
                        "name": name,
                        "price": price,
                        "category": category,
                        "img": local_img_path,
                        "description": f"Premium {name} available for immediate shipment.",
                        "features": ["Authentic", "Fast Shipping", "Wholesale Available"]
                    })
            except Exception as e:
                print(f"Error parsing item: {e}")
                
    except Exception as e:
        print(f"Error scraping page {page}: {e}")
    
    time.sleep(2) # Wait 2 seconds between pages

# Save to JSON
if products:
    with open(DATA_FILE, 'w') as f:
        json.dump(products, f, indent=2)
    print(f"Scraping complete. {len(products)} products saved to {DATA_FILE}.")
else:
    print("No products found.")
