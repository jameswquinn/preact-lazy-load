import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

const LazyImage = ({ src, srcset, sizes, alt }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    if ('loading' in HTMLImageElement.prototype) {
      imgRef.current.src = src;
      imgRef.current.srcset = srcset;
    } else {
      setupLazyLoadingFallback();
    }

    function setupLazyLoadingFallback() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              imgRef.current.src = src;
              imgRef.current.srcset = srcset;
              observer.unobserve(imgRef.current);
            }
          });
        }, { rootMargin: '0px 0px 50px 0px' });
        observer.observe(imgRef.current);
      } else {
        imgRef.current.src = src;
        imgRef.current.srcset = srcset;
      }
    }
  }, [src, srcset]);

  return (
    <img
      ref={imgRef}
      sizes={sizes}
      loading="lazy"
      alt={alt}
    />
  );
};

export default LazyImage;
