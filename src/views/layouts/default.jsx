const React = require('react');

function DefaultLayout(props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/public/semantic.min.css" />
        <script src="/public/socket.io.js"></script>
        <title>{props.title}</title>
      </head>
      <body>
        <div className="ui container">
          <nav className="ui top menu">
            <div className="menu left">
              <div className="header item">Tomas Company</div>
              <a className="item" href="/">
                Inicio
              </a>
              <a className="item" href="/puertos">
                Puertos
              </a>
              <a className="item" href="/read">
                Read Json
              </a>
            </div>
            <div className="right menu">
              <a className="item" href="">
                {props.iplocal}
              </a>
            </div>
          </nav>
        </div>

        <main>
          <div className="ui container" style={{ 'marginTop': '05px' }}>
            {props.children}
          </div>
        </main>
      </body>
    </html>
  );
}

module.exports = DefaultLayout;
