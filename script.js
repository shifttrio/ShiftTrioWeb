// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    // Initialize particles.js
    if (document.getElementById('particles-js')) {
      particlesJS.load('particles-js', 'particles-config.json', function() {
        console.log('Particles.js loaded');
      });
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
      const isExpanded = nav.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
      this.classList.toggle('open');
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.classList.remove('open');
        }
      });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
        header.style.padding = '10px 0';
      } else {
        header.style.background = 'var(--dark-color)';
        header.style.padding = '15px 0';
      }
    });
    
    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', toggleDarkMode);
      
      // Check for saved user preference
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.setAttribute('data-theme', 'dark');
        darkModeToggle.textContent = '☀️';
      }
    }

    // Initialize contact form
    initContactForm();
});

// Dark mode function
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  
  if (isDark) {
    body.removeAttribute('data-theme');
    localStorage.setItem('darkMode', 'false');
    darkModeToggle.textContent = '🌓';
  } else {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkMode', 'true');
    darkModeToggle.textContent = '☀️';
  }
}

// Contact form initialization
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const reason = document.getElementById('reason').value;
      const message = document.getElementById('message').value.trim();
      
      // Phone number validation
      const phoneRegex = /^\+998\d{9}$/;
      let formattedPhone = phone.replace(/\D/g, ''); // Keep only digits
      
      if (formattedPhone.startsWith('998') && formattedPhone.length === 12) {
        formattedPhone = '+' + formattedPhone;
      } else if (formattedPhone.startsWith('0') && formattedPhone.length === 9) {
        formattedPhone = '+998' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+998') && formattedPhone.length === 9) {
        formattedPhone = '+998' + formattedPhone;
      }
      
      // Validate all fields
      if (!name || !phone || !reason || !message) {
        showFormMessage('Iltimos, barcha maydonlarni toʻldiring!', 'error');
        return;
      }
      
      if (!phoneRegex.test(formattedPhone)) {
        showFormMessage('Iltimos, toʻgʻri telefon raqamini kiriting! (+998XXXXXXXXX)', 'error');
        return;
      }
      
      sendFormData(name, formattedPhone, reason, message);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.startsWith('998')) {
          value = '+' + value;
        }
        
        // Format: +998 XX XXX XX XX
        if (value.length > 4) {
          value = value.substring(0, 4) + ' ' + value.substring(4);
        }
        if (value.length > 7) {
          value = value.substring(0, 7) + ' ' + value.substring(7);
        }
        if (value.length > 11) {
          value = value.substring(0, 11) + ' ' + value.substring(11);
        }
        if (value.length > 14) {
          value = value.substring(0, 14);
        }
        
        this.value = value;
      });
    }
  }
}

// Send form data to Telegram
function sendFormData(name, phone, reason, message) {
  const text = `📬 Yangi xabar!\n\n👤 Ism: ${name}\n📞 Tel: ${phone}\n📌 Sababi: ${reason}\n💬 Xabar: ${message}\n🌍 Manzil: Toshkent`;
  
  const token = '7992642305:AAFMfdyjqKxO8uEl61_Z-5-CTXsq89DKNlc'; // Replace with your bot token
  const chat_id = '6997326968'; // Replace with your chat ID
  
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  // Show loading state
  const submitBtn = document.querySelector('#contact-form button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = "Yuborilmoqda...";
  submitBtn.disabled = true;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chat_id,
      text: text,
      parse_mode: 'Markdown'
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then(data => {
    if (data.ok) {
      showFormMessage('✅ Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.', 'success');
      document.getElementById('contact-form').reset();
    } else {
      showFormMessage('❌ Xatolik yuz berdi! Iltimos, keyinroq urinib ko\'ring.', 'error');
      console.error(data);
    }
  })
  .catch(err => {
    showFormMessage('❌ Tarmoqqa ulanishda xatolik! Internet aloqasini tekshiring.', 'error');
    console.error(err);
  })
  .finally(() => {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  });
}

// Show form message
function showFormMessage(message, type) {
  const formMessage = document.getElementById('form-message');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';
  formMessage.style.opacity = '1';
  
  // Hide message after 5 seconds
  setTimeout(() => {
    formMessage.style.opacity = '0';
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 300);
  }, 5000);
}

// Modal functions
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate progress bars
    setTimeout(() => {
      const progressBars = modal.querySelectorAll('.progress');
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      
      // Rotate avatar
      const avatar = modal.querySelector('.modal-avatar');
      avatar.style.transform = 'translateX(-50%) rotate(0deg)';
      setTimeout(() => {
        avatar.style.transform = 'translateX(-50%) rotate(360deg)';
      }, 200);
    }, 300);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function openProjectModal(title, description, imageUrl) {
  document.getElementById('projectModalTitle').textContent = title;
  document.getElementById('projectModalDesc').textContent = description;
  document.getElementById('projectModalImage').src = imageUrl;
  document.getElementById('projectModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modals = document.querySelectorAll('.modal, .modern-modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal, .modern-modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
});

// Initialize member cards
document.querySelectorAll('.member-card').forEach(card => {
  card.addEventListener('click', function() {
    const modalId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
    openModal(modalId);
  });
  
  // Keyboard accessibility
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const modalId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      openModal(modalId);
    }
  });
});