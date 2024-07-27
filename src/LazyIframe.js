import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

const LazyIframe = ({ src, title }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if ('loading' in HTMLIFrameElement.prototype) {
      iframeRef.current.src = src;
    } else {
      setupLazyLoadingFallback();
    }

    function setupLazyLoadingFallback() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              iframeRef.current.src = src;
              observer.unobserve(iframeRef.current);
            }
          });
        }, { rootMargin: '0px 0px 50px 0px' });
        observer.observe(iframeRef.current);
      } else {
        iframeRef.current.src = src;
      }
    }
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      loading="lazy"
      title={title}
    ></iframe>
  );
};

export default LazyIframe;
