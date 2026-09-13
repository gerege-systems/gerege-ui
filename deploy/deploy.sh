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
# гардаг. Статик хостынгоо root-ыг <репо>/apps/site/dist руу заа — тэр нь
# apps/site/releases/<commit> руу заасан symlink; солилт нь нэг rename тул
# хүсэлт хагас хавтас, эсвэл хавтасгүй агшинд таарахгүй.
# Шалгалт хийлгэх бол: VERIFY_URL=https://<хост>/ bash deploy/deploy.sh —
# 200 биш бол өмнөх release руу буцаагаад 1-ээр гарна.
set -euo pipefail

main() {
  local root site releases release previous
  root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  cd "$root"
  site="$root/apps/site"
  releases="$site/releases"

  echo "== pull =="
  git pull --ff-only
  git log -1 --format='%h %s'

  echo "== install =="
  pnpm install --frozen-lockfile

  echo "== build =="
  # Амьд dist дээр биш тусдаа хавтаст build хийж, дуусмагц symlink-ийг солино.
  # `pnpm run build` нь prebuild (props хүснэгт үүсгэх)-ийг ч ажиллуулна.
  release="$releases/$(git rev-parse --short HEAD)-$(date +%Y%m%d%H%M%S)"
  pnpm --filter @gerege-systems/ui build
  rm -rf "$site/dist.new"
  pnpm --filter @gerege-systems/site run build --outDir dist.new --emptyOutDir
  mkdir -p "$releases"
  mv "$site/dist.new" "$release"

  echo "== swap =="
  previous=""
  if [ -L "$site/dist" ]; then
    previous="$(readlink -f "$site/dist")"
  elif [ -d "$site/dist" ]; then
    # Нэг удаагийн шилжилт: хуучин бодит хавтас release болж хадгалагдана.
    previous="$releases/legacy-$(date +%Y%m%d%H%M%S)"
    mv "$site/dist" "$previous"
  fi
  ln -sfn "$release" "$site/dist.tmp"
  mv -T "$site/dist.tmp" "$site/dist"
  echo "dist -> $(readlink "$site/dist") ($(find "$release" -type f | wc -l | tr -d ' ') файл)"

  if [ -n "${VERIFY_URL:-}" ]; then
    echo "== verify =="
    local code
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$VERIFY_URL" || echo 000)
    echo "$VERIFY_URL -> $code"
    if [ "$code" != "200" ]; then
      if [ -n "$previous" ] && [ -d "$previous" ]; then
        ln -sfn "$previous" "$site/dist.tmp"
        mv -T "$site/dist.tmp" "$site/dist"
        echo "ХАРИУ 200 БИШ — өмнөх release руу буцаав: $(readlink "$site/dist")"
      else
        echo "ХАРИУ 200 БИШ — буцаах өмнөх release алга"
      fi
      exit 1
    fi
  fi

  echo "== prune =="
  # Одоогийнх + сүүлийн 2 үлдээнэ; rollback-д хангалттай, диск дүүрэхгүй.
  ls -1dt "$releases"/*/ 2>/dev/null | grep -vF "$(readlink -f "$site/dist")/" | tail -n +3 | xargs -r rm -rf

  exit 0
}

main "$@"
