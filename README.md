# Proyecto: EDUMAP Barcelona

## Descripción General
Este proyecto tiene como objetivo crear una aplicación web que permita a los usuarios visualizar y analizar datos relacionados con el acceso y equidad a la educación en los diferentes distritos de Barcelona. El sistema está dividido en tres áreas de desarrollo: Data Analyst, Back-End, y Front-End.

La aplicación muestra mapas interactivos con los siguientes indicadores clave por distrito:
- Rentas medias familiares.
- Cantidad de actividades educativas.
- Establecimientos educativos reglados.
- Establecimientos no reglados.
- Actividades ofrecidas por centros cívicos.

Esta información es de acceso público y proviene de datasets sobre educación de OpenData Barcelona, permitiendo al usuario visualizar cómo se relacionan estos indicadores en cada distrito.

## Estructura del Proyecto

### 1. Data Analyst
El equipo de Data Analyst es responsable de realizar el análisis exploratorio de los datasets públicos. Se trabaja principalmente con Python con notebook y las librerías de análisis de datos son Pandas.

#### Tareas principales:
- Recolección de datasets públicos.
- Limpieza y tratamiento de los datos.
- Exploración de los datos para identificar patrones y posibles correlaciones.
- Preparación de los datos para ser utilizados por el equipo de Back-End.

#### Entregables:
- Un repositorio con los datasets limpios y tratados.
- Un informe o notebook con el análisis exploratorio.
- Archivos en formatos CSV o JSON listos para su integración con el Back-End.

#### Tecnologías:
- Python
- Librería Pandas
- Notebook
- Google Sheet

#### Equipo Data:
- Simone Solieri
- Esteban Piliponsky
- Rodrigo Padilla

### 2. Back-End
El equipo de Back-End es el encargado de recibir los datos limpios del equipo de Data Analyst, crear las API necesarias para que el Front-End pueda acceder a ellos, y manejar las interacciones con los datos.

#### Tareas principales:
- Preparación y diseño de las API para acceder a los datos limpios.
- Estructuración de los endpoints para entregar los datos en función de los distritos y las variables necesarias.
- Asegurar la comunicación eficiente entre el Front-End y los datos del servidor.

#### Entregables:
- API documentadas para acceder a los datos procesados.
- Integración de los datos a través de los endpoints en un formato adecuado (JSON).

#### Tecnologías:
- Java 21
- Spring Boot
- H2

#### Equipo Back End:
- Alba Marquez
- Miguel Granado
- Diego Kurcbart

### 3. Front-End
El equipo de Front-End es responsable de crear la interfaz de usuario (UI) que permitirá visualizar los datos provistos por el Back-End en forma de mapas interactivos.

#### Tareas principales:
- Desarrollo de la interfaz gráfica responsive para la aplicación web.
- Integración con la API del Back-End para visualizar los datos en tiempo real.
- Creación de mapas interactivos que visualizan las siguientes variables por distrito:
  - Rentas medias familiares.
  - Cantidad de actividades educativas.
  - Establecimientos educativos reglados.
  - Establecimientos educativos no reglados.
  - Cantidad de actividades por centros cívicos.
- Permitir la consulta de indicadores de manera interactiva y visual en el mapa.

#### Entregables:
- Aplicación web funcional con mapas interactivos.
- Gráficos y visualizaciones de los datos que permitan una fácil interpretación de los indicadores.
- Documentación de uso de la aplicación web.

#### Tecnologías:
- Angular
- Mapbox (para los mapas interactivos)
- Tailwind

#### Equipo Front End:
- Carlos Martinez
- Julibeth Rivero
- Francesc Ferré
- Alessandro De Pietri Tonelli

## Funcionalidades de la Aplicación Web
La aplicación web permite a los usuarios:
- Visualizar en un mapa interactivo los indicadores de renta media familiar, actividades educativas y establecimientos educativos (reglados y no reglados) por distrito.
- Consultar cómo se distribuyen las actividades educativas por los centros cívicos en cada distrito.
- Explorar la relación entre la renta familiar y la cantidad de actividades educativas por distrito.

Estas funcionalidades buscan proporcionar a los usuarios una herramienta de fácil consulta para comprender mejor la distribución de los recursos educativos en la ciudad de Barcelona.

## Ejemplo de Código HTML
```html
<div class="col-2 flex flex-wrap">
  <div class="flex justify-center items-center text-sm text-center w-[120px] bg-low">
    <span>Fins a 35k</span>
  </div>
  <div class="flex justify-center items-center text-sm text-center w-[120px] bg-medium">
    <span>De 35k a 45k</span>
  </div>
  <div class="flex justify-center items-center text-sm text-center w-[120px] bg-high">
    <span>De 45k a 55k</span>
  </div>
  <div class="flex justify-center items-center text-sm text-center w-[120px] bg-veryHigh">
    <span>De 55k a 65k</span>
  </div>
  <div class="flex justify-center items-center text-sm text-center w-[120px] bg-extreme">
    <span>De 65k a 80k</span>
  </div>
</div>
