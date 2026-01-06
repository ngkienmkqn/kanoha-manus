import xml.etree.ElementTree as ET
import json
import os
import requests
import re
from urllib.parse import urlparse

XML_FILE = "/home/ubuntu/upload/pasted_file_GyHyAY_kanohagoods.WordPress.2026-01-06.xml"
IMAGE_DIR = "/home/ubuntu/kanoha-import/client/public/images/products/"
DATA_FILE = "/home/ubuntu/kanoha-import/client/src/data/products.json"

# Ensure directories exist
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

# Namespaces in the XML
namespaces = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/'
}

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).replace(" ", "_")

def download_image(url, filename):
    if not url: return "/images/products/placeholder.webp"
    
    local_path = os.path.join(IMAGE_DIR, filename)
    # Check if file exists and is not empty
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return f"/images/products/{filename}"

    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return f"/images/products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    
    return "/images/products/placeholder.webp"

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
    attachments = {} # Map post_id to image URL

    # First pass: Collect all attachments (images)
    for item in channel.findall('item'):
        post_type = item.find('wp:post_type', namespaces).text
        post_id = item.find('wp:post_id', namespaces).text
        
        if post_type == 'attachment':
            attachment_url = item.find('wp:attachment_url', namespaces).text
            if attachment_url:
                attachments[post_id] = attachment_url

    print(f"Found {len(attachments)} attachments.")

    # Second pass: Collect products
    for item in channel.findall('item'):
        post_type = item.find('wp:post_type', namespaces).text
        
        if post_type == 'product':
            title = item.find('title').text
            post_id = item.find('wp:post_id', namespaces).text
            
            # Get Categories
            categories = []
            for cat in item.findall('category'):
                if cat.get('domain') == 'product_cat':
                    categories.append(cat.text)
            
            category = categories[0] if categories else "Uncategorized"
            
            # Get Image
            # Look for _thumbnail_id meta
            thumbnail_id = None
            for meta in item.findall('wp:postmeta', namespaces):
                key = meta.find('wp:meta_key', namespaces).text
                if key == '_thumbnail_id':
                    thumbnail_id = meta.find('wp:meta_value', namespaces).text
                    break
            
            image_url = attachments.get(thumbnail_id) if thumbnail_id else None
            
            # Download Image
            local_image_path = "/images/products/placeholder.webp"
            if image_url:
                ext = os.path.splitext(urlparse(image_url).path)[1]
                if not ext: ext = ".jpg"
                filename = f"{post_id}_{clean_filename(title)[:30]}{ext}"
                local_image_path = download_image(image_url, filename)
            
            # Get Price (simplified, looking for _price meta)
            price = "Contact for Price"
            for meta in item.findall('wp:postmeta', namespaces):
                key = meta.find('wp:meta_key', namespaces).text
                if key == '_price':
                    val = meta.find('wp:meta_value', namespaces).text
                    if val: price = f"${val}"
                    break

            products.append({
                "id": post_id,
                "name": title,
                "price": price,
                "category": category,
                "img": local_image_path,
                "description": f"Premium {title}.",
                "features": ["Authentic", "Fast Shipping"]
            })

    print(f"Found {len(products)} products.")
    
    # Save to JSON
    with open(DATA_FILE, 'w') as f:
        json.dump(products, f, indent=2)
    print(f"Saved to {DATA_FILE}")

if __name__ == "__main__":
    parse_xml()
