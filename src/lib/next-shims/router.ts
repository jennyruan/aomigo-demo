export const useRouter = () => ({
  push: (url: string) => window.location.href = url,
  replace: (url: string) => window.location.replace(url),
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  pathname: window.location.pathname,
  query: Object.fromEntries(new URLSearchParams(window.location.search)),
  asPath: window.location.pathname + window.location.search,
});

export default { useRouter };
