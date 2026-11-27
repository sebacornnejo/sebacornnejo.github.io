# Publicar Holistic Ocean Data en GitHub Pages

El ZIP es la edición estática de tu portafolio. Lleva la portada, el blog, el CV, el portafolio académico y el laboratorio en HTML, CSS y JavaScript. GitHub sirve esos archivos directamente. El dominio previsto es [sebacornnejo.github.io](https://sebacornnejo.github.io/).

## 1. Extrae la entrega

En el Explorador de Windows, haz clic derecho en `Holistic-Ocean-Data-GitHub-Pages.zip` y elige **Extraer todo**. Abre la carpeta que contiene `index.html`. Allí deben aparecer también `.nojekyll`, `static`, `media`, `blog` y `laboratorio`. Puedes activar **Ver → Mostrar → Elementos ocultos** para comprobar los archivos con punto. Esta carpeta contiene todo lo que se publica. El ZIP original de Django y las demás carpetas de trabajo quedan en tu equipo.

## 2. Abre una copia del repositorio en GitHub Desktop

Inicia sesión en **GitHub Desktop** con la cuenta que administra el sitio. En **File → Clone repository → URL**, pega `https://github.com/sebacornnejo/sebacornnejo.github.io.git`. Elige una carpeta local distinta de la que extrajiste y pulsa **Clone**. Si ya tienes un clon de este repositorio, selecciónalo en **Current repository**. [Ayuda oficial para clonar](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

## 3. Prepara la actualización

En **Current branch**, selecciona `main` y pulsa **Fetch origin**. Si aparece **Pull origin**, púlsalo también. Desde **Current branch → New branch**, crea `actualizar-portafolio` a partir de `main`. Usa **Repository → Show in Explorer** para abrir la carpeta del clon.

Copia el **contenido** de la entrega extraída en esa carpeta. Cuando Windows pregunte, elige **Reemplazar los archivos en el destino**. Comprueba que `index.html` y `.nojekyll` estén directamente junto a `.git`. Conserva la carpeta `.git` del clon. Las rutas de navegación empiezan por `/`, por eso importa que el sitio quede en la raíz.

## 4. Comprueba el sitio en tu equipo

Si tienes Python en Windows, abre una terminal en la carpeta del clon y ejecuta `py -m http.server 8000 --bind 127.0.0.1`. Si tu instalación usa el comando `python`, reemplaza `py` por `python`. Abre [la portada local](http://127.0.0.1:8000/) y prueba los enlaces del pie y el laboratorio. Usa **Ctrl+C** en la terminal para detener la prueba. Abrir `index.html` con doble clic usa rutas de disco y no reproduce la navegación de GitHub Pages. Este paso local es opcional.

## 5. Sube e integra la versión

En **Changes** de GitHub Desktop, revisa que aparecen las páginas y sus recursos. En **Summary** escribe `Actualizar Holistic Ocean Data` y pulsa **Commit to actualizar-portafolio**. Pulsa **Publish branch**. En **Branch → Create pull request**, abre la propuesta en GitHub con base `main` y comparación `actualizar-portafolio`. Pulsa **Create pull request**, revisa los archivos y completa **Merge pull request → Confirm merge**.

## 6. Activa GitHub Pages

En el repositorio de GitHub, abre **Settings → Pages → Build and deployment**. En **Source**, selecciona **Deploy from a branch**. En **Branch**, elige **main** y **/(root)** y pulsa **Save** si cambiaste algún valor. Activa **Enforce HTTPS** si está disponible. [Configuración oficial de la fuente](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [HTTPS en GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## 7. Comprueba la publicación

En **Actions**, abre la ejecución de Pages que corresponde al commit integrado. Cuando el trabajo de despliegue termine en verde, vuelve a **Settings → Pages → Visit site**.

- En la [portada pública](https://sebacornnejo.github.io/) debe aparecer **Holistic Ocean Data**. Baja al pie y pulsa **ABOUT ME**, luego **PORTFOLIO (A)** y **HOME**.
- Abre [una entrada directa del blog](https://sebacornnejo.github.io/blog/7/) y recarga la página para comprobar la ruta.
- En el [portafolio general](https://sebacornnejo.github.io/portfoliog/#interactive-examples), abre un gráfico de la ficha sobre anarquía y ciérralo para seguir en la misma página. Al final, **More → Visualization Lab** abre el índice de gráficos. Los enlaces directos, como [el gráfico de clústeres](https://sebacornnejo.github.io/ClustersMallCustomers.html), siguen disponibles. Los mapas de estados piden las teselas de fondo en línea.
- El [contacto](https://sebacornnejo.github.io/contactme/) abre un borrador en la aplicación de correo del visitante. El formulario procesa los campos en la pestaña.

Si todavía ves la portada anterior, comprueba primero el commit de la última ejecución de Pages. Si ya terminó correctamente, recarga con **Ctrl+F5**. Ante un **404** general, revisa la rama, la carpeta de publicación y la posición de `index.html`. Si necesitas volver a la versión previa, abre la propuesta ya integrada, pulsa **Revert** e integra la propuesta de reversión que crea GitHub. El historial del repositorio conserva ambas versiones.
