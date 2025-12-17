import { useState, useEffect } from 'react'
import './App.css'
import notFound from "./assets/img/error.jpg";

function App() {
  

  var [pagina, setPagina] = useState(1);
  var [datos, setDatos] = useState([]);
  const [buscarClick, setBuscarClick] = useState(0);

  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("");
  const [detalle, setDetalle] = useState(null)
  const [verDetalle, setMostrarDetalle] = useState(false);
  const [cargando, setCargando] = useState(false);

    useEffect( () => {
      if(titulo === "") return;
      var url = "https://www.omdbapi.com/?apikey=ea2bc7f8&s="+ encodeURIComponent(titulo) +"&page=" + pagina;

      if (ano !== "") 
      {
        url = url + "&y=" + ano;
      }

      if(tipo !== "")
      {
        url = url + "&type=" + tipo;
      }

      setCargando(true);

      fetch(url)
      .then(response=> response.json())
      .then(data => {
          console.log(data);
          if (data.Search) {
            setDatos(datos.concat(data.Search));
          }
          setCargando(false);
      });
    }, [pagina, buscarClick]);

    //UseEffect pal scroll infinito
    useEffect( () =>{
      function scrollInfinito()
      {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight -200 && !cargando)
        {
          setPagina(pagina + 1);
        }
      }

      window.addEventListener("scroll", scrollInfinito)

      return() => {
        window.removeEventListener("scroll", scrollInfinito);
      }
    }, [cargando, pagina]);

  function cargaMas()
  {
    setPagina(pagina+1);

  }
  function buscar() 
  {
    setPagina(1);
    setDatos([]);
    setBuscarClick(buscarClick +1)
  }
  function cargarDetalle(id)
  {
    fetch("https://www.omdbapi.com/?apikey=ea2bc7f8&i=" + id + "&plot=full")
    .then(res => res.json())
    .then(data => {
      setDetalle(data);
      setMostrarDetalle(true);
    });
  }
  
  var pelicula = datos.map ((peli)=> 
  <li key={peli.imdbID} onClick={() => cargarDetalle(peli.imdbID)}>
    <p>{peli.Title}</p>
    <p>{peli.Year}</p>
    <img
      src={peli.Poster !== "N/A" ? peli.Poster : notFound}
      alt={peli.Title}
      onError={(e) => { e.target.src = notFound; }}
    />
  </li>)
  
  
  return (
    <>
      <h1 className="titulo-principal">Cartelera</h1>

      <p className="intro">
        Aquí podrás encontrar cualquier película o serie que tengas en mente.  
        Solo deberás buscarla.
      </p>

      <div className="buscador-barra">
        <input
          type="text"
          placeholder="Ingrese el título que desee buscar"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="number"
          placeholder="Año"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />

        <div className="filtros">
          <label>
            <input
              type="radio"
              name="tipo"
              value=""
              checked={tipo === ""}
              onChange={(e) => setTipo(e.target.value)}
            />
            <span>Todas</span>
          </label>

          <label>
            <input
              type="radio"
              name="tipo"
              value="movie"
              checked={tipo === "movie"}
              onChange={(e) => setTipo(e.target.value)}
            />
            <span>Películas</span>
          </label>

          <label>
            <input
              type="radio"
              name="tipo"
              value="series"
              checked={tipo === "series"}
              onChange={(e) => setTipo(e.target.value)}
            />
            <span>Series</span>
          </label>
        </div>

        <button className="btn-buscar" onClick={buscar}>
          Buscar
        </button>
      </div>

      <ul className="grid-peliculas">
        {pelicula}
      </ul>

      {verDetalle && detalle && (
      <div className='detalle-overlay'>
        <div className='detalle-card'>
          <button
            className='btn-cerrar'
            onClick={() => setMostrarDetalle(false)}
          >
            ✕
          </button>

          <div className='detalle-img'>
            <img 
              src={detalle.Poster !== "N/A" ? detalle.Poster : notFound}
              alt={detalle.Title}
            />
          </div>

          <div className='detalle-info'>
            <h2>{detalle.Title}</h2>

            <p><span className="detalle-label">Año:</span> {detalle.Year}</p>
            <p><span className="detalle-label">Duración:</span> {detalle.Runtime}</p>
            <p><span className="detalle-label">Género:</span> {detalle.Genre}</p>
            <p><span className="detalle-label">Director:</span> {detalle.Director}</p>
            <p><span className="detalle-label">Actores:</span> {detalle.Actors}</p>

            <p className="detalle-plot">{detalle.Plot}</p>
          </div>
        </div>
      </div>
    )}

    </>
  )
}

export default App
