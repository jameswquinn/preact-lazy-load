To extract the code into an npm library that can be easily implemented in a new Preact app, you will need to structure your code as a reusable package. Here’s a step-by-step guide to creating an npm package for lazy loading in Preact:

### Step-by-Step Guide

#### 1. Set Up the NPM Package

1. **Create a new directory for your library:**
    ```sh
    mkdir preact-lazy-load
    cd preact-lazy-load
    ```

2. **Initialize the npm package:**
    ```sh
    npm init -y
    ```

3. **Install Preact as a dependency:**
    ```sh
    npm install preact
    ```

4. **Create the required directory structure:**
    ```sh
    mkdir src
    touch src/index.js src/LazyImage.js src/LazyIframe.js src/LazyBackgroundImage.js
    ```

#### 2. Write the Library Code

##### `src/index.js`
This file will export all the components.
```jsx
export { default as LazyImage } from './LazyImage';
export { default as LazyIframe } from './LazyIframe';
export { default as LazyBackgroundImage } from './LazyBackgroundImage';
```

##### `src/LazyImage.js`
```jsx
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
```

##### `src/LazyIframe.js`
```jsx
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
```

##### `src/LazyBackgroundImage.js`
```jsx
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
```

#### 3. Add Styles

Since styles need to be included for the library to work correctly, create a `style.css` file and include it in the package. 

Create `src/style.css`:
```css
.lazy-background {
  opacity: 0;
  transition: opacity 0.3s;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.lazy-background[data-loaded] {
  opacity: 1;
}
```

Modify `src/index.js` to include the styles:
```jsx
import './style.css';

export { default as LazyImage } from './LazyImage';
export { default as LazyIframe } from './LazyIframe';
export { default as LazyBackgroundImage } from './LazyBackgroundImage';
```

#### 4. Bundle the Library

You will need to set up a bundler like Rollup to bundle your library. Here is an example configuration using Rollup.

1. **Install Rollup and necessary plugins:**
    ```sh
    npm install --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @rollup/plugin-terser
    ```

2. **Create `rollup.config.mjs`:**
    ```js
    import babel from "@rollup/plugin-babel";
    import terser from "@rollup/plugin-terser";
    import postcss from "rollup-plugin-postcss";
    
    export default {
      input: "src/index.js",
      output: {
        file: "dist/bundle.js",
        format: "esm",
      },
      plugins: [
        postcss({
          extract: true,
          minimize: true,
          extensions: [".css"],
        }),
        babel({
          babelHelpers: "bundled",
          presets: ["@babel/preset-env"],
          plugins: [
            [
              "@babel/plugin-transform-react-jsx",
              { pragma: "h", pragmaFrag: "Fragment" },
            ],
          ],
          extensions: [".js", ".jsx"],
        }),
        terser(),
      ],
    };
    ```

3. **Add build scripts to `package.json`:**
    ```json
    "scripts": {
      "build": "rollup -c"
    },
    ```

4. **Add .babelrc :**
   ```.babelrc
   ```
       

#### 5. Build and Publish the Library

1. **Build the library:**
    ```sh
    npm run build
    ```

2. **Publish the package:**
    ```sh
    npm publish
    ```

#### 6. Use the Library in a New Preact App

1. **Create a new Preact app:**
    ```sh
    npx preact-cli create default my-new-preact-app
    cd my-new-preact-app
    ```

2. **Install the library:**
    ```sh
    npm install preact-lazy-load
    ```

3. **Use the library in your Preact app:**

##### `src/index.js`
```jsx
import { h, render } from 'preact';
import App from './components/App';
import './style.css';

render(<App />, document.body);
```

##### `src/components/App.js`
```jsx
import { h } from 'preact';
import { LazyImage, LazyIframe, LazyBackgroundImage } from 'preact-lazy-load';

const App = () => (
  <div>
    <h1>Native Lazy Loading in Preact</h1>
    
    <h2>Lazy Load Image</h2>
    <LazyImage 
      src="path/to/image.jpg" 
      srcset="path/to/image-320w.jpg 320w, path/to/image-480w.jpg 480w" 
      sizes="(max-width: 600px) 320px, 480px" 
      alt="Description of image"
    />
    
    <h2>Lazy Load Iframe</h2>
    <LazyIframe 
      src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
      title="Sample Video"
    />
    
    <h2>Lazy Load Background Image</h2>
    <LazyBackgroundImage 
      src="path/to/background-image.jpg"
    >
      <p>Content overlaying the background image</p>
    </LazyBackgroundImage>
  </div>
);

export default App;
```

With this setup, you have created an npm library for lazy loading components in Preact that can be easily integrated into any Preact project.
