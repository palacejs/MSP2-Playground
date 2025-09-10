// Shop functionality
let currentFormData = {};

// Show purchase form
function showPurchaseForm() {
  document.getElementById('shopMainView').style.display = 'none';
  document.getElementById('purchaseFormView').style.display = 'block';
  
  // Reset form
  document.getElementById('purchaseForm').reset();
  document.getElementById('cardDetails').style.display = 'none';
}

// Show shop main view
function showShopMain() {
  document.getElementById('shopMainView').style.display = 'block';
  document.getElementById('purchaseFormView').style.display = 'none';
  document.getElementById('securityView').style.display = 'none';
}

// Show security verification
function showSecurityView() {
  document.getElementById('purchaseFormView').style.display = 'none';
  document.getElementById('securityView').style.display = 'block';
  
  // Generate random security code for demo
  const securityCode = Math.floor(100000 + Math.random() * 900000);
  console.log('Demo Security Code:', securityCode); // For demo purposes
}

// Handle payment method change
document.addEventListener('DOMContentLoaded', function() {
  const paymentInputs = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('cardDetails');
  
  paymentInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.value === 'visa' || this.value === 'mastercard') {
        cardDetails.style.display = 'block';
        
        // Make card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('expiryDate').required = true;
        document.getElementById('cvv').required = true;
      } else {
        cardDetails.style.display = 'none';
        
        // Remove required from card fields
        document.getElementById('cardNumber').required = false;
        document.getElementById('expiryDate').required = false;
        document.getElementById('cvv').required = false;
      }
    });
  });

  // Format card number input
  document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
  });

  // Format expiry date input
  document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // Handle form submission
  document.getElementById('purchaseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    currentFormData = {
      email: document.getElementById('userEmail').value,
      username: document.getElementById('username').value,
      paymentMethod: document.querySelector('input[name="payment"]:checked')?.value,
      cardNumber: document.getElementById('cardNumber').value,
      expiryDate: document.getElementById('expiryDate').value,
      cvv: document.getElementById('cvv').value,
      product: 'MSP2 Troll License',
      amount: '$1.00'
    };
    
    // Validate payment method selection
    if (!currentFormData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Process payment
    if (currentFormData.paymentMethod === 'paypal') {
      processPayPalPayment();
    } else {
      showSecurityView();
    }
  });
});

// Process PayPal payment
function processPayPalPayment() {
  // Simulate PayPal redirect
  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=sehan.beydullayev12@gmail.com&item_name=MSP2 Troll License&amount=1.00&currency_code=USD&return=success&cancel_return=cancel`;
  
  // For demo - just show success
  setTimeout(() => {
    sendPurchaseEmail();
    showSuccessMessage();
  }, 2000);
  
  // In real implementation, redirect to PayPal
  // window.location.href = paypalUrl;
}

// Verify 3D security
function verifySecurity() {
  const securityCode = document.getElementById('securityCode').value;
  
  if (securityCode.length !== 6) {
    alert('Please enter a 6-digit security code');
    return;
  }
  
  // Simulate security verification
  setTimeout(() => {
    // Process payment
    processCardPayment();
  }, 1500);
}

// Process card payment
function processCardPayment() {
  // Simulate payment processing
  setTimeout(() => {
    sendPurchaseEmail();
    showSuccessMessage();
  }, 2000);
}

// Send purchase email
function sendPurchaseEmail() {
  // In a real implementation, this would send an email to sehan.beydullayev0130@gmail.com
  // For now, we'll just log the data that would be sent
  
  const emailData = {
    to: 'sehan.beydullayev0130@gmail.com',
    subject: 'New Purchase - MSP2 Troll License',
    body: `
      New purchase details:
      
      Customer Email: ${currentFormData.email}
      Username: ${currentFormData.username}
      Product: ${currentFormData.product}
      Amount: ${currentFormData.amount}
      Payment Method: ${currentFormData.paymentMethod}
      
      ${currentFormData.paymentMethod !== 'paypal' ? `
      Card Number: ****-****-****-${currentFormData.cardNumber?.slice(-4)}
      Expiry: ${currentFormData.expiryDate}
      ` : ''}
      
      Transaction Date: ${new Date().toLocaleString()}
    `
  };
  
  console.log('Email would be sent:', emailData);
  
  // In real implementation, use a service like EmailJS or backend API
  // EmailJS example:
  // emailjs.send("service_id", "template_id", emailData);
}

// Show success message
function showSuccessMessage() {
  alert('Payment successful! You will receive your license via email shortly.');
  window.closeModal('shopModal');
  showShopMain();
}

// Make functions global
window.showPurchaseForm = showPurchaseForm;
window.showShopMain = showShopMain;
window.verifySecurity = verifySecurity;
