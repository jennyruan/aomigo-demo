export const useRouter = () => ({
  push: (url: string) => window.location.href = url,
  replace: (url: string) => window.location.replace(url),
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  refresh: () => window.location.reload(),
  prefetch: () => {},
});

export const usePathname = () => window.location.pathname;

export const useSearchParams = () => new URLSearchParams(window.location.search);

export const redirect = (url: string) => {
  window.location.href = url;
};

export const notFound = () => {
  throw new Error('Not found');
};

export enum RedirectType {
  push = 'push',
  replace = 'replace',
}
