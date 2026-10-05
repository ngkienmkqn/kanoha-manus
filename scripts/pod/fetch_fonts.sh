#!/bin/sh
# Tải font Google Fonts (SIL OFL / Apache 2.0) dùng cho hình in
cd "$(dirname "$0")" && mkdir -p fonts && cd fonts
B=https://raw.githubusercontent.com/google/fonts/main
for f in ofl/anton/Anton-Regular.ttf ofl/bebasneue/BebasNeue-Regular.ttf ofl/pacifico/Pacifico-Regular.ttf \
  ofl/lobster/Lobster-Regular.ttf ofl/shrikhand/Shrikhand-Regular.ttf apache/permanentmarker/PermanentMarker-Regular.ttf \
  ofl/righteous/Righteous-Regular.ttf ofl/greatvibes/GreatVibes-Regular.ttf ofl/alfaslabone/AlfaSlabOne-Regular.ttf \
  ofl/bungee/Bungee-Regular.ttf ofl/sacramento/Sacramento-Regular.ttf ofl/archivoblack/ArchivoBlack-Regular.ttf \
  ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf ofl/bowlbyonesc/BowlbyOneSC-Regular.ttf ofl/caveatbrush/CaveatBrush-Regular.ttf \
  apache/specialelite/SpecialElite-Regular.ttf ofl/kaushanscript/KaushanScript-Regular.ttf apache/satisfy/Satisfy-Regular.ttf \
  apache/chewy/Chewy-Regular.ttf "ofl/oswald/Oswald%5Bwght%5D.ttf" "ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" \
  "ofl/montserrat/Montserrat%5Bwght%5D.ttf" "ofl/cinzel/Cinzel%5Bwght%5D.ttf" "ofl/dancingscript/DancingScript%5Bwght%5D.ttf"; do
  n=$(basename "$f" | sed 's/%5B.*%5D//')
  [ -s "$n" ] || curl -sfL "$B/$f" -o "$n"
done
