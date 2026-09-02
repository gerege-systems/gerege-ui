#!/usr/bin/env bash
# Сервер дээр ажиллана: git pull → build → dist-ийг атомоор солих.
# Урсгал: локал засвар → GitHub → энэ скрипт (сервер дээр эх код засахгүй).
#
# Бүх ажил main() дотор: bash скриптийг мөр мөрөөр уншдаг тул git pull
# скриптийг өөрийг нь шинэчлэхэд дундаас нь хуучин/шинэ хольж уншихаас
# хамгаална — main-ийг дуудах мөр файлын төгсгөлд байгаа үед функц бүхэлдээ
# аль хэдийн уншигдсан байдаг.
#
# Хаана ажиллаж байгааг таамаглахгүй: репогийн үндэс нь энэ скриптийн байрлалаас
# гардаг. Статик хостынгоо root-ыг <репо>/apps/site/dist руу заа.
# Шалгалт хийлгэх бол: VERIFY_URL=https://<хост>/ bash deploy/deploy.sh
set -euo pipefail

main() {
  local root
  root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  cd "$root"

  echo "== pull =="
  git pull --ff-only
  git log -1 --format='%h %s'

  echo "== install =="
  pnpm install --frozen-lockfile

  echo "== build =="
  # Амьд dist дээр биш тусдаа хавтаст build хийж, дуусмагц атомоор солино
  # (build дунд орсон хүсэлт хагас файл авахаас сэргийлнэ).
  pnpm --filter @gerege-systems/ui build
  rm -rf apps/site/dist.new
  pnpm --filter @gerege-systems/site exec vite build --outDir dist.new --emptyOutDir

  rm -rf apps/site/dist.prev
  [ -d apps/site/dist ] && mv apps/site/dist apps/site/dist.prev
  mv apps/site/dist.new apps/site/dist
  echo "dist: $(find apps/site/dist -type f | wc -l | tr -d ' ') файл"

  if [ -n "${VERIFY_URL:-}" ]; then
    echo "== verify =="
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$VERIFY_URL")
    echo "$VERIFY_URL -> $code"
    [ "$code" = "200" ] || { echo "ХАРИУ 200 БИШ — dist.prev-ээс буцаах боломжтой"; exit 1; }
  fi

  exit 0
}

main "$@"
