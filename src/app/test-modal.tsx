"use client";

export default function TestModal() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'red',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'yellow',
        border: '4px solid red',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize: '32px', fontWeight: 'bold', color: 'black', marginBottom: '15px'}}>
          ¡MODAL FUNCIONANDO!
        </h1>
        <p style={{fontSize: '18px', color: 'black', marginBottom: '30px'}}>
          Si ves esto, el modal funciona
        </p>
        <button
          onClick={() => {
            console.log('🔧 Test button clicked');
            alert('¡Botón funcionando!');
          }}
          style={{
            width: '100%',
            backgroundColor: 'green',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🇪🇸 Español
        </button>
      </div>
    </div>
  );
}
