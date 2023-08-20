window.onload = () => {
    var slideUp = {
      distance: '150%',
      origin: 'bottom',
      opacity: null
  };
  
  
  ScrollReveal().reveal('.intro', slideUp,  { duration: 1000 });
  ScrollReveal().reveal('h6', slideUp, { delay: 1000 });
  ScrollReveal().reveal('.features', slideUp, { delay: 2000 });
  ScrollReveal().reveal('.actual-articles', slideUp,  { duration: 1000 });
  ScrollReveal().reveal('.actual-articles-1', slideUp,  { duration: 2000 });
  ScrollReveal().reveal('p2', slideUp,  { duration: 2000 });
  ScrollReveal().reveal('articles', slideUp,  { duration: 2000 });
  
  }
  
  
  
  
  