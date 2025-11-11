import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useAuth } from '../context/AuthContext';

export const VideoPlayer = ({ src, hlsSrc, poster }) => {
  const videoRef = useRef(null);
  const watermarkRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const video = videoRef.current;
    
    // Deshabilitar clic derecho
    const disableContextMenu = (e) => e.preventDefault();
    video.addEventListener('contextmenu', disableContextMenu);

    // Si hay URL HLS disponible
    if (hlsSrc && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(hlsSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest cargado');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('Error HLS:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
        video.removeEventListener('contextmenu', disableContextMenu);
      };
    } else if (hlsSrc && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      video.src = hlsSrc;
    } else if (src) {
      // Fallback a MP4
      video.src = src;
    }

    return () => {
      video.removeEventListener('contextmenu', disableContextMenu);
    };
  }, [src, hlsSrc]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <video
        ref={videoRef}
        controls
        poster={poster}
        style={{ width: '100%', borderRadius: '8px' }}
      />
      {user && (
        <div
          ref={watermarkRef}
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '20px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {user.email}
        </div>
      )}
    </div>
  );
};
