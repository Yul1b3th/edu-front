# EduMap Barcelona

## Descripción

**EduMap Barcelona** es una aplicación web que permite a los usuarios visualizar
y analizar datos relacionados con el acceso y la equidad en la educación de los
diferentes distritos de Barcelona.

La aplicación presenta mapas interactivos que muestran los siguientes
indicadores clave por distrito:

- Rentas medias familiares anuales
- Establecimientos educativos de educación infantil
- Establecimientos educativos de educación primaria
- Establecimientos educativos de educación secundaria

Estos datos provienen de **OpenData Barcelona**, garantizando que la información
sea de acceso público y esté actualizada.

Este proyecto fue desarrollado como parte de la hackatón de la **IT Academy**,
realizada el 22 de octubre de 2024, por un equipo compuesto por profesionales
de: [**Data Analyst**](#equipo-data), [**Back-End**](#equipo-back-end) y
[**Front-End**](#equipo-front-end).

## Demo

Puedes ver la demostración de la aplicación en
[EduMap](https://edu-front-delta.vercel.app/).

## Características

- **Visualización Interactiva**: La aplicación ofrece mapas interactivos que
  permiten a los usuarios explorar y analizar datos educativos de manera
  intuitiva y dinámica.

- **Indicadores Clave**: Muestra información relevante, como rentas medias
  familiares anuales y la ubicación de establecimientos educativos (infantil,
  primario y secundario) en cada distrito de Barcelona.

- **Acceso a Datos Públicos**: Utiliza datasets de OpenData Barcelona,
  asegurando que la información sea accesible y actualizada para todos los
  usuarios.

- **Diseño Responsivo**: La interfaz está diseñada para ser compatible con
  dispositivos móviles y de escritorio, ofreciendo una experiencia uniforme en
  todas las plataformas.

- **Integración con API**: Conexión directa con el backend para gestionar datos
  de manera eficiente y en tiempo real.

## Interacción con la API "EduMap"

Este proyecto frontend se integra con la API
[EduMap](https://github.com/amarinite/hackatonITAcademy), la cual sigue una
arquitectura RESTful, facilitando su integración y uso. Puedes explorar la
[documentación de la API](https://hackatonitacademy-4eb658690555.herokuapp.com/webjars/swagger-ui/index.html)
para obtener detalles sobre los endpoints, métodos HTTP y estructura de los
datos.

## Tecnologías Utilizadas

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
- [SCSS](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Angular CLI](https://angular.dev/) versión 18.2.9
- [Mapbox](https://www.mapbox.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Requisitos

- Node.js y npm instalados en tu sistema. Descárgalos desde
  [nodejs.org](https://nodejs.org/).
- Angular CLI instalado globalmente. Instálalo con el siguiente comando:

```bash
npm install -g @angular/cli
```

## Instalación y Despliegue

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Yul1b3th/edu-front.git
   ```

2. Ingresa al directorio del proyecto:

   ```bash
   cd edu-front
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Ejecuta la aplicación en modo desarrollo:

   ```bash
   ng serve -o
   ```

### Despliegue

1. Ejecuta el comando de construcción para compilar la aplicación Angular:

```bash
ng build --prod
```

2. Los archivos generados se almacenarán en el directorio `dist/`. Puedes
   desplegar estos archivos en un servidor web o en un servicio de alojamiento
   que admita aplicaciones web estáticas.

## Pruebas Unitarias con Karma y Jasmine

Este proyecto cuenta con pruebas unitarias implementadas utilizando **Karma** y
**Jasmine**.

- **Servicio _EduService_**:

  El servicio **_EduService_** incluye pruebas para garantizar que los datos se
  obtienen correctamente desde la API, las cuales verifican: la obtención de
  datos de renta de los distritos, asegurando que se recuperen adecuadamente; la
  recuperación de datos relacionados con la educación infantil; la correcta
  obtención de los datos de educación primaria; y la confirmación de que se
  puedan obtener correctamente los datos de educación secundaria.

  Para ejecutar las pruebas del servicio **_EduService_**, utiliza el comando:

  ```bash
  ng test --include src/app/path/to/your/edu.service.spec.ts
  ```

- **Componente _AppComponent_**:

  El componente **_AppComponent_** tiene una prueba para verificar su correcta
  creación. Se asegura de que el componente se inicialice correctamente y esté
  disponible para su uso en la aplicación.

  Para ejecutar las pruebas del componente **_AppComponent_**, utiliza el
  comando:

  ```bash
  ng test --include src/app/path/to/your/app.component.spec.ts
  ```

Para ejecutar todas las pruebas en el proyecto, utiliza este comando:

```bash
ng test
```

## Equipo

El equipo está compuesto por un grupo de profesionales apasionados por la
tecnología y la innovación, especializados en las siguientes áreas:

#### Equipo Data:

<ul>
    <li><a href="https://github.com/epili50" target="_blank">Esteban Piliponsky</a></li>
    <li><a href="https://github.com/ErrePad/" target="_blank">Rodrigo Padilla</a></li>
    <li><a href="https://github.com/sisolieri" target="_blank">Simone Solieri</a></li>
</ul>

#### Equipo Back End:

<ul>
    <li><a href="https://github.com/amarinite" target="_blank">Alba Marquez</a></li>
    <li><a href="https://github.com/dKurbi" target="_blank">Diego Kurcbart</a></li>
    <li><a href="https://github.com/Mettanoia" target="_blank">Miguel Granado</a></li>
</ul>

#### Equipo Front End:

<ul>
    <li><a href="https://github.com/adptCode" target="_blank">Alessandro De Pietri Tonelli</a></li>
    <li><a href="https://github.com/carlos-full-stack" target="_blank">Carlos Martinez</a></li>
    <li><a href="https://github.com/fran-cesc" target="_blank">Francesc Ferrer</a></li>
    <li><a href="https://github.com/Yul1b3th" target="_blank">Yulibeth Rivero</a></li>
</ul>

## Contribuciones

Si deseas colaborar en este proyecto o informar sobre problemas, no dudes en
crear un "issue" o enviar un "pull request."

## Licencia

Este proyecto está bajo la Licencia [Nombre de la Licencia]. Ver el archivo
LICENSE.md para más detalles.
