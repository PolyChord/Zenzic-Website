# Zenzic-Website

This repository contains everything necessary for the Zenzic demonstration website. It is fully static and hosted directly on Github Pages [here](https://polychord.github.io/Zenzic-Website/), which uses Jekyll internally. Please see the [documentation](https://jekyllrb.com/docs/) for how to install Jekyll and serve the website locally on your machine when working on it to see changes take effect immediately without needing to push to the repository. The basic layout and design elements are forked from the Jekyll [Freelancer theme](https://jeromelachaud.com/freelancer-theme). Interactive elements are coded in Javascript (folder js/) and all images/parameters are precalculated/produced. When new commits are pushed to this repository's master branch, changes are automatically deployed to the website.

The contact section uses Formspree for sending emails to maud.formanek@polychord.co.uk. To change this, setup a new email form on [Formspree](https://formspree.io/) and modify the following line in the _includes/contact_static.html file:

```<form action="//formspree.io/f/mvonlvgz" method="POST" name="sentMessage" id="contactForm" novalidate>```
