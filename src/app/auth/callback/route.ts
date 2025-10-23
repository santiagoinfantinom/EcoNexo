import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    // Redirect back to login with error
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (code) {
    // Handle successful OAuth callback
    try {
      // Extract user data based on provider
      let userData = null;
      
      if (state === 'google') {
        // For Google, we'll simulate extracting user data
        // In a real implementation, you'd exchange the code for an access token
        // and then fetch user profile data from Google's API
        userData = {
          provider: 'google',
          name: 'Usuario Google',
          email: 'usuario@gmail.com',
          picture: 'https://via.placeholder.com/150/4285f4/ffffff?text=G',
          locale: 'es',
          verified_email: true,
          timestamp: Date.now()
        };
      } else if (state === 'microsoft') {
        // For Microsoft, simulate extracting user data
        userData = {
          provider: 'microsoft',
          name: 'Usuario Microsoft',
          email: 'usuario@outlook.com',
          picture: 'https://via.placeholder.com/150/0078d4/ffffff?text=M',
          locale: 'es',
          verified_email: true,
          timestamp: Date.now()
        };
      }
      
      // Store OAuth data in localStorage for profile import
      if (userData) {
        // Create a page that will store the data in localStorage and redirect
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Importando datos...</title>
            </head>
            <body>
              <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                <h2>📥 Importando tus datos...</h2>
                <p>Por favor espera mientras extraemos tu información.</p>
                <div style="margin: 20px 0;">
                  <div style="width: 200px; height: 4px; background: #f0f0f0; border-radius: 2px; margin: 0 auto;">
                    <div style="width: 100%; height: 100%; background: #4CAF50; border-radius: 2px; animation: progress 2s ease-in-out;"></div>
                  </div>
                </div>
              </div>
              <style>
                @keyframes progress {
                  0% { width: 0%; }
                  100% { width: 100%; }
                }
              </style>
              <script>
                // Store OAuth data in localStorage
                localStorage.setItem('oauth_data', JSON.stringify(${JSON.stringify(userData)}));
                
                // Redirect to profile after a short delay
                setTimeout(() => {
                  window.location.href = '/perfil?oauth=${state}&imported=true';
                }, 2000);
              </script>
            </body>
          </html>
        `;
        
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }
      
    } catch (err) {
      console.error('Error processing OAuth callback:', err);
    }
    
    // Fallback redirect
    const profileUrl = new URL("/perfil", request.url);
    profileUrl.searchParams.set("oauth", "success");
    profileUrl.searchParams.set("provider", state || 'unknown');
    
    return NextResponse.redirect(profileUrl);
  }

  // Default redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}