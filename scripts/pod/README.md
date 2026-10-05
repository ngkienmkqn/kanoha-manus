# POD apparel generator

Sinh ảnh mockup + dữ liệu sản phẩm quần áo in theo yêu cầu (POD) cho trang `/products`.

**Nguồn ảnh (miễn phí):**
- Áo trơn có người mặc: Printful product catalog API (`api.printful.com/products`, công khai, không cần key). Printful cho phép người bán POD dùng ảnh sản phẩm/mockup của họ.
- Hình in tranh: Art Institute of Chicago API và Cleveland Museum of Art Open Access — chỉ lấy tác phẩm CC0 / public domain. Danh sách ghi công: `client/public/images/apparel/CREDITS.md`.
- Câu chữ: tự soạn; câu Kinh Thánh dùng bản King James (public domain).
- Font: Google Fonts (SIL OFL / Apache 2.0).

**Chạy lại** (cần Python 3 + Pillow + numpy):

```sh
python3 -m venv .venv && .venv/bin/pip install pillow numpy
.venv/bin/python fetch_blanks.py && .venv/bin/python dl_colors.py   # áo trơn
.venv/bin/python fetch_full.py                                    # tranh đã chọn
./fetch_fonts.sh                                                  # font
.venv/bin/python build.py                                         # -> client/public/images/apparel + client/src/data/apparel.json
```

- Thêm câu chữ mới: sửa `phrases.py`.
- Thêm/bớt tranh: `picks.txt` là chỉ số trong `art/candidates.json` (sinh bởi `fetch_art.py` → `thumbs.py` → `score.py`); loại trừ ở `EXCLUDE`, đặt tên đẹp ở `TITLES` trong `build.py`.
- Vùng in từng mẫu áo: `GARMENTS` trong `mockup.py`.
