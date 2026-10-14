/* 予伴不再使用 service worker。
 * 这个文件存在的唯一目的：替换掉浏览器里残留的旧 service worker
 *（如 NextChat 时代注册的），安装后立即注销整个注册，避免旧逻辑干扰。
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => self.clients.claim())
      .catch(() => {}),
  );
});
