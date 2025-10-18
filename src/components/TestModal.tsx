"use client";
import { useEffect } from 'react';

export default function TestModal() {
  useEffect(() => {
    console.log('🔧 TEST MODAL: Component mounted');
    
    // Create modal immediately
    const createModal = () => {
      console.log('🔧 CREATING MODAL: Starting modal creation');
      
      // Remove any existing modal
      const existingModal = document.getElementById('test-modal');
      if (existingModal) {
        existingModal.remove();
      }
      
      // Create modal HTML
      const modalHTML = `
        <div id="test-modal" style="
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: red !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999999 !important;
          padding: 20px !important;
          visibility: visible !important;
          opacity: 1 !important;
        ">
          <div style="
            background-color: yellow !important;
            border: 4px solid red !important;
            border-radius: 20px !important;
            padding: 40px !important;
            max-width: 500px !important;
            width: 100% !important;
            text-align: center !important;
            position: relative !important;
          ">
            <div style="font-size: 80px; margin-bottom: 20px;">🌍</div>
            <h1 style="font-size: 32px; font-weight: bold; color: black; margin-bottom: 15px;">
              ¡Bienvenido a EcoNexo!
            </h1>
            <p style="font-size: 18px; color: black; margin-bottom: 30px;">
              Selecciona tu idioma preferido para comenzar
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
              <button onclick="localStorage.setItem('econexo:locale', 'es'); window.location.reload();" style="
                width: 100% !important;
                background-color: green !important;
                color: white !important;
                padding: 15px 30px !important;
                border-radius: 12px !important;
                border: none !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
              ">🇪🇸 Español</button>
              <button onclick="localStorage.setItem('econexo:locale', 'en'); window.location.reload();" style="
                width: 100% !important;
                background-color: green !important;
                color: white !important;
                padding: 15px 30px !important;
                border-radius: 12px !important;
                border: none !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
              ">🇬🇧 English</button>
              <button onclick="localStorage.setItem('econexo:locale', 'de'); window.location.reload();" style="
                width: 100% !important;
                background-color: green !important;
                color: white !important;
                padding: 15px 30px !important;
                border-radius: 12px !important;
                border: none !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
              ">🇩🇪 Deutsch</button>
            </div>
          </div>
        </div>
      `;
      
      // Insert modal into body
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      console.log('🔧 MODAL CREATED: Modal inserted into DOM');
      
      // Force visibility
      const modal = document.getElementById('test-modal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('🔧 MODAL VISIBLE: Modal should now be visible');
      } else {
        console.error('🔧 MODAL ERROR: Modal not found after creation');
      }
    };
    
    // Execute immediately
    createModal();
    
    // Also try after a small delay
    setTimeout(createModal, 100);
    setTimeout(createModal, 500);
    setTimeout(createModal, 1000);
    
  }, []);

  return null; // This component doesn't render anything
}
