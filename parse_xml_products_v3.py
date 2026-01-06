import xml.etree.ElementTree as ET
import json
import os
import requests
import re
from urllib.parse import urlparse
import concurrent.futures

XML_FILE = "/home/ubuntu/upload/pasted_file_GyHyAY_kanohagoods.WordPress.2026-01-06.xml"
IMAGE_DIR = "/home/ubuntu/kanoha-import/client/public/images/products/"
DATA_FILE = "/home/ubuntu/kanoha-import/client/src/data/products.json"

# Ensure directories exist
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

namespaces = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/'
}

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).replace(" ", "_")

def download_image_task(args):
    url, filename = args
    if not url: return "/images/products/placeholder.webp"
    
    local_path = os.path.join(IMAGE_DIR, filename)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return f"/images/products/{filename}"

    try:
        # Very short timeout to fail fast
        response = requests.get(url, stream=True, timeout=3)
        if response.status_code == 200:
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return f"/images/products/{filename}"
    except:
        pass
    
    return "/images/products/placeholder.webp"

def categorize_product(title):
    title_lower = title.lower()
    if any(x in title_lower for x in ['earbud', 'headphone', 'speaker', 'audio', 'sound', 'mic', 'radio']):
        return "Audio"
    if any(x in title_lower for x in ['adapter', 'plug', 'cable', 'charger', 'usb', 'power', 'battery']):
        return "Electronics Accessories"
    if any(x in title_lower for x in ['kitchen', 'cook', 'pan', 'pot', 'knife', 'blender', 'grill', 'maker']):
        return "Kitchenware"
    if any(x in title_lower for x in ['toy', 'game', 'puzzle', 'doll', 'car']):
        return "Toys & Games"
    if any(x in title_lower for x in ['bag', 'case', 'backpack', 'tote', 'luggage']):
        return "Bags & Cases"
    if any(x in title_lower for x in ['watch', 'clock', 'alarm']):
        return "Clocks & Watches"
    return "General Merchandise"

def parse_xml():
    print("Parsing XML file...")
    try:
        tree = ET.parse(XML_FILE)
        root = tree.getroot()
        channel = root.find('channel')
    except Exception as e:
        print(f"Error parsing XML: {e}")
        return

    products = []
    download_tasks = []
    
    # Process attachments as products
    for item in channel.findall('item'):
        post_type = item.find('wp:post_type', namespaces).text
        
        if post_type == 'attachment':
            title = item.find('title').text
            post_id = item.find('wp:post_id', namespaces).text
            attachment_url = item.find('wp:attachment_url', namespaces).text
            
            if not title or not attachment_url:
                continue

            category = categorize_product(title)
            
            ext = os.path.splitext(urlparse(attachment_url).path)[1]
            if not ext: ext = ".jpg"
            filename = f"{post_id}_{clean_filename(title)[:30]}{ext}"
            
            download_tasks.append((attachment_url, filename))
            
            products.append({
                "id": post_id,
                "name": title,
                "price": "Contact for Price",
                "category": category,
                "img": f"/images/products/{filename}", # Assume success or placeholder will replace file content
                "description": f"High-quality {title} available for wholesale.",
                "features": ["Authentic", "Fast Shipping"]
            })

    print(f"Found {len(products)} products. Downloading images in parallel...")
    
    # Parallel download
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(download_image_task, download_tasks))
    
    # Update image paths based on results (though we pre-calculated filenames, some might have failed to placeholder)
    # Actually, the download function returns the path to use. We should map it back.
    # But since we pre-calculated the filename, we can just check if the file exists.
    
    for p in products:
        local_path = os.path.join(IMAGE_DIR, os.path.basename(p['img']))
        if not os.path.exists(local_path) or os.path.getsize(local_path) == 0:
             p['img'] = "/images/products/placeholder.webp"

    # Save to JSON
    with open(DATA_FILE, 'w') as f:
        json.dump(products, f, indent=2)
    print(f"Saved to {DATA_FILE}")

if __name__ == "__main__":
    parse_xml()
