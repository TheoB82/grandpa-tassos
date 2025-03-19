import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Link to Google Fonts for Roboto (if still needed) */}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
          
          {/* Add local font (Mynerve) */}
          <style>{`
            @font-face {
              font-family: 'Mynerve';
              src: url('/fonts/Mynerve.Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
