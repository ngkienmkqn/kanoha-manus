import json
import os

# Paths
json_path = '/home/ubuntu/kanoha-import/client/src/data/products.json'
images_dir = '/home/ubuntu/kanoha-import/client/public'

# Load products
with open(json_path, 'r') as f:
    products = json.load(f)

print(f"Total products before cleaning: {len(products)}")

# Filter products
valid_products = []
removed_count = 0

for product in products:
    image_url = product.get('img')
    if not image_url:
        removed_count += 1
        continue
        
    # Check if image file exists locally
    # The image URL in json is like "/images/products/filename.jpg"
    # We need to check if "client/public/images/products/filename.jpg" exists
    
    # Remove leading slash for path joining
    relative_path = image_url.lstrip('/')
    full_path = os.path.join(images_dir, relative_path)
    
    if os.path.exists(full_path):
        valid_products.append(product)
    else:
        # print(f"Removing product {product['name']}: Image not found at {full_path}")
        removed_count += 1

print(f"Removed {removed_count} products with missing images.")
print(f"Total products after cleaning: {len(valid_products)}")

# Save cleaned products
with open(json_path, 'w') as f:
    json.dump(valid_products, f, indent=2)

print("Successfully updated products.json")
