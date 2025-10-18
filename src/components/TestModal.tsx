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
          background: linear-gradient(135deg, #0f4c3a 0%, #1a5f3f 50%, #2d7a3a 100%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999999 !important;
          padding: 20px !important;
          visibility: visible !important;
          opacity: 1 !important;
        ">
          <div style="
            background: linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%) !important;
            border: 2px solid #10b981 !important;
            border-radius: 24px !important;
            padding: 40px !important;
            max-width: 500px !important;
            width: 100% !important;
            text-align: center !important;
            position: relative !important;
            box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25) !important;
          ">
            <div style="font-size: 80px; margin-bottom: 20px;">🌍</div>
            <h1 style="font-size: 32px; font-weight: bold; color: #064e3b; margin-bottom: 15px;">
              ¡Bienvenido a EcoNexo!
            </h1>
            <p style="font-size: 18px; color: #374151; margin-bottom: 30px;">
              Selecciona tu idioma preferido para comenzar
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button onclick="localStorage.setItem('econexo:locale', 'es'); localStorage.setItem('econexo-language-set', 'true'); localStorage.setItem('econexo-preferred-language', 'es'); document.getElementById('test-modal').remove();" style="
                width: 100% !important;
                background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%) !important;
                color: white !important;
                padding: 16px 32px !important;
                border-radius: 16px !important;
                border: none !important;
                font-size: 18px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.3) !important;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px 0 rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px 0 rgba(16, 185, 129, 0.3)'">🇪🇸 Español</button>
              <button onclick="localStorage.setItem('econexo:locale', 'en'); localStorage.setItem('econexo-language-set', 'true'); localStorage.setItem('econexo-preferred-language', 'en'); document.getElementById('test-modal').remove();" style="
                width: 100% !important;
                background: linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%) !important;
                color: white !important;
                padding: 16px 32px !important;
                border-radius: 16px !important;
                border: none !important;
                font-size: 18px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 14px 0 rgba(5, 150, 105, 0.3) !important;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px 0 rgba(5, 150, 105, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px 0 rgba(5, 150, 105, 0.3)'">🇬🇧 English</button>
              <button onclick="localStorage.setItem('econexo:locale', 'de'); localStorage.setItem('econexo-language-set', 'true'); localStorage.setItem('econexo-preferred-language', 'de'); document.getElementById('test-modal').remove();" style="
                width: 100% !important;
                background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%) !important;
                color: white !important;
                padding: 16px 32px !important;
                border-radius: 16px !important;
                border: none !important;
                font-size: 18px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 14px 0 rgba(4, 120, 87, 0.3) !important;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px 0 rgba(4, 120, 87, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px 0 rgba(4, 120, 87, 0.3)'">🇩🇪 Deutsch</button>
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
