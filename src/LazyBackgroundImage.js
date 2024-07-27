import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

const LazyBackgroundImage = ({ src, children }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            divRef.current.style.backgroundImage = `url(${src})`;
            divRef.current.setAttribute('data-loaded', 'true');
            observer.disconnect();
          }
        });
      }, { rootMargin: '0px 0px 50px 0px' });
      observer.observe(divRef.current);
    } else {
      // Fallback for older browsers
      divRef.current.style.backgroundImage = `url(${src})`;
      divRef.current.setAttribute('data-loaded', 'true');
    }
  }, [src]);

  return (
    <div ref={divRef} className="lazy-background">
      {children}
    </div>
  );
};

export default LazyBackgroundImage;
