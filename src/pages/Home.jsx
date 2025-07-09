import React, { useState, useEffect } from 'react';
import { GiEarthAmerica, GiMedal } from 'react-icons/gi';
import { MdHistory, MdGroups } from 'react-icons/md';
import { IoMdBusiness } from 'react-icons/io';
import NavBar from '../navigation/NavBar';
import LabsaLogo from '../components/LabsaLogo';
import '../styles/Home.css';

// Componente Home con animación de carga
const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-bubbles">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="loading-bubble" 
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBar />
      
      <div className="content-wrapper">
        <div className="logo-container">
          <LabsaLogo />
        </div>

        <div className="title-container fade-in">
          <h1 className="main-title">LABORATORIOS Y SUMINISTROS AMBIENTALES E INDUSTRIALES</h1>
          <p className="description">
            <strong>Laboratorio ACREDITADO por la EMA y APROBADO por CONAGUA, STPS y PROFEPA.</strong>
          </p>
        </div>
      </div>

      <section className="timeline-section fade-in">
        <div className="section-header">
          <MdHistory className="section-icon" />
          <h3 className="section-title">Historia</h3>
        </div>

          <div className="timeline-container">
            {[
              { 
                year: '2011', 
                title: 'Fundación', 
                description: 'Laboratorios y Suministros Ambientales e Industriales brinda servicios de análisis microbiológicos y fisicoquímicos en aguas residuales y suelos contaminados, así como en ambiente laboral.' 
              },
              { 
                year: '2012', 
                title: 'Acreditación y Aprobación', 
                description: 'Logramos la acreditación POR EMA y la aprobación por parte de la CONAGUA, PROFEPA y STPS.' 
              },
              { 
                year: '2015', 
                title: 'Ampliación de Signatarios', 
                description: 'Durante la renovación de la acreditación ante la EMA, ampliamos la plantilla de signatarios y personal.' 
              },
              { 
                year: '2018', 
                title: 'Pruebas de Aptitud Satisfactorias', 
                description: 'Participamos en ensayos de aptitud a nivel nacional e internacional obteniendo resultados satisfactorios.' 
              },
              { 
                year: '2022', 
                title: 'Compromiso', 
                description: 'Seguimos creciendo y capacitando a nuestro personal y clientes para garantizar el cumplimiento de la normatividad nacional e internacional.' 
              }
            ].map((event, index) => (
              <div key={index} className="timeline-event">
                <div className="timeline-date">{event.year}</div>
                <div className="timeline-content">
                  <h4 className="timeline-title">{event.title}</h4>
                  <p className="timeline-text">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
      </section>

      <section className="about-section fade-in">
        <div className="about-overlay"></div>
        <div className="about-content">
          <div className="about-header">
            <MdGroups className="about-icon" />
            <h1 className="about-title">
              <strong>¿Quiénes Somos?</strong>
            </h1>
          </div>
          <p className="about-text">
            LABSA es un laboratorio de análisis ambientales e industriales, especializado en la rama de agua residual y suelo contaminado. Contamos con más de 10 años de experiencia en la industria, con equipos y tecnología de punta, garantizando la satisfacción de nuestros clientes y la confiabilidad de nuestros análisis y resultados.
          </p>
        </div>
      </section>
            
      <section className="values-section fade-in">
        <h3 className="values-title">Nuestros Principios</h3>
        <div className="values-grid">
          <div className="value-card">
            <div className="card-icon">
              <IoMdBusiness />
            </div>
            <h5 className="card-title"><strong>Misión</strong></h5>
            <p className="card-text">
              Realizar muestreo y análisis de la industria, aguas, aire, fuentes fijas, residuos, suelos, higiene y salud ocupacional, proporcionando resultados confiables.
            </p>
          </div>

          <div className="value-card">
            <div className="card-icon">
              <GiEarthAmerica />
            </div>
            <h5 className="card-title"><strong>Visión</strong></h5>
            <p className="card-text">
              Ser una empresa reconocida a nivel nacional, apoyando la protección ambiental y la prevención de la contaminación en equilibrio con las condiciones socioeconómicas de las partes interesadas.
            </p>
          </div>

          <div className="value-card">
            <div className="card-icon">
              <GiMedal />
            </div>
            <h5 className="card-title"><strong>Valores</strong></h5>
            <p className="card-text">
              Humildad, Igualdad, Pertenencia, Ética, Eficiencia, Trabajo en Equipo, Solidaridad, Compromiso, Honestidad, Lealtad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;