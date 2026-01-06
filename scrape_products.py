import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re

BASE_URL = "https://kanohagoods.com/shop/page/{}/"
IMAGE_DIR = "/home/ubuntu/kanoha-import/client/public/images/products/"
DATA_FILE = "/home/ubuntu/kanoha-import/client/src/data/products.json"

# Ensure directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

products = []
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).replace(" ", "_")

def download_image(url, filename):
    try:
        response = requests.get(url, headers=headers, stream=True)
        if response.status_code == 200:
            path = os.path.join(IMAGE_DIR, filename)
            with open(path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return f"/images/products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return "/images/products/placeholder.webp" # Fallback

total_pages = 47
for page in range(1, total_pages + 1):
    print(f"Scraping page {page}/{total_pages}...")
    try:
        response = requests.get(BASE_URL.format(page), headers=headers)
        if response.status_code != 200:
            print(f"Failed to load page {page}")
            continue
            
        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select('.product') # Adjust selector based on actual site structure
        
        # If .product selector fails, try a more generic one or inspect the page source
        if not items:
             items = soup.select('li.product')

        for item in items:
            try:
                name_el = item.select_one('.woocommerce-loop-product__title')
                price_el = item.select_one('.price')
                img_el = item.select_one('img')
                link_el = item.select_one('a.woocommerce-LoopProduct-link')
                
                if name_el and img_el:
                    name = name_el.text.strip()
                    price = price_el.text.strip() if price_el else "Contact for Price"
                    img_url = img_el.get('src')
                    # Get higher res image if available in srcset
                    if img_el.get('srcset'):
                        img_url = img_el.get('srcset').split(',')[-1].strip().split(' ')[0]
                        
                    # Generate a unique ID and filename
                    product_id = str(len(products) + 1)
                    img_ext = img_url.split('.')[-1].split('?')[0]
                    if len(img_ext) > 4: img_ext = "jpg"
                    img_filename = f"{product_id}_{clean_filename(name)[:50]}.{img_ext}"
                    
                    local_img_path = download_image(img_url, img_filename)
                    
                    # Try to extract category from class names
                    classes = item.get('class', [])
                    categories = [c.replace('product_cat-', '') for c in classes if c.startswith('product_cat-')]
                    category = categories[0].replace('-', ' ').title() if categories else "Uncategorized"

                    products.append({
                        "id": product_id,
                        "name": name,
                        "price": price,
                        "category": category,
                        "img": local_img_path,
                        "description": f"High-quality {name} available for wholesale and dropshipping.", # Placeholder desc
                        "features": ["Authentic Quality", "Fast Shipping", "Warranty Included"] # Placeholder features
                    })
            except Exception as e:
                print(f"Error parsing item: {e}")
                
    except Exception as e:
        print(f"Error scraping page {page}: {e}")
    
    # Be polite to the server
    time.sleep(1)

# Save to JSON
with open(DATA_FILE, 'w') as f:
    json.dump(products, f, indent=2)

print(f"Scraping complete. {len(products)} products saved.")
