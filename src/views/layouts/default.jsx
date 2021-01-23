const React = require('react');

function DefaultLayout(props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/pubic/semantic.min.css" />
        <title>{props.title}</title>
      </head>
      <body>
        <nav className="ui menu">
          <div className="ui container">
            <div className="header item">Tomas Company</div>
            <a className="item" href="/">
              Inicio
            </a>
            <a className="item" href="/puertos">
              Puertos
            </a>
            <a className="item" href="/read">
              Valores Json
            </a>
          </div>
        </nav>

        <main>
          <div className="ui container" style={{ 'marginTop': '05px' }}>
            {props.children}
          </div>
        </main>
        {/* <script src="/css/jquery.min.js"></script>
        <script src="/css/semantic.min.js"></script> */}
      </body>
    </html>
  );
}

module.exports = DefaultLayout;
