import React from 'react';
import '../ImpactSwiper/ImpactSwiper.scss';
import { mediaCardProps } from '../mediaCard/mediaCards';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import YouTube from 'react-youtube';

interface ImpactSwiperProps {
  items: mediaCardProps[];  
}

const ImpactSwiper: React.FC<ImpactSwiperProps> = ({ items}) => {
  // Ensure each item has a key property for type safety
  const safeItems = items.map((item, idx) => ({ ...item, key: idx }));
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Store Swiper instance
  const swiperRef = React.useRef<SwiperClass | null>(null);

  // Group items by 'group' property (passed from parent)
  // Use type assertion since group is injected in Impact page
  const itemsWithGroup = safeItems as (mediaCardProps & { group: string })[];
  const groups = itemsWithGroup.reduce<{ [key: string]: Array<{ item: typeof itemsWithGroup[number]; originalIdx: number }> }>((acc, item, idx) => {
    const group = item.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push({ item, originalIdx: idx });
    return acc;
  }, {});
  const groupOrder = Object.keys(groups);

  // Find the original index for correct selection
  const handleSelect = (originalIdx: number) => setActiveIndex(originalIdx);

  React.useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
      if (swiperRef.current.pagination && typeof swiperRef.current.pagination.render === 'function') {
        swiperRef.current.pagination.render();
      }
      if (swiperRef.current.pagination && typeof swiperRef.current.pagination.update === 'function') {
        swiperRef.current.pagination.update();
      }
    }
  }, [activeIndex]);

  return (
    <div className="container impact-swiper">
      <div className="container-wrapper">
        <div className="impact-legenda">
          <ul className="impact-legenda__list">
            {groupOrder.map((group, gIdx) => (
              <React.Fragment key={group}>
                <li
                  className="impact-legenda__title"
                  style={{ fontWeight: 'bold', marginTop: gIdx > 0 ? 16 : 0, cursor: 'default', pointerEvents: 'none', color: '#444' }}
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  {group}
                </li>
                <div className="items-wrapper">
                {groups[group].map(({ item, originalIdx }) => (
              
                  <li
                    key={item.key}
                    className={activeIndex === originalIdx ? 'active' : ''}
                    onMouseEnter={() => handleSelect(originalIdx)}
                    onClick={() => handleSelect(originalIdx)}
                  >
                    {item.mediaType}
                  </li>
                )
                              

                )}
                    </div>
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="divider"></div>

        <div className="list-content-items" style={{ flex: 1 }}>
            {safeItems.length > 0 && (
              <div className="main" id={`impact-${activeIndex}`} key={activeIndex}>
                <div className="left-side">
                  <div className="main-wrapper">
                    <h3 className="main-header-mustache">{safeItems[activeIndex].date}</h3>
                    <h3 className="main-header">{safeItems[activeIndex].mediaType}</h3>
                    <h1 className="main-title">{safeItems[activeIndex].subject}</h1>
                    <h2 className="main-subtitle">{safeItems[activeIndex].peopleInvolved}</h2>
                  </div>
                  <div className="main-content">
                    <div className="more-menu">
                      {safeItems[activeIndex].description}
                    </div>
                    {safeItems[activeIndex].link && (
                      <a className="link" href={safeItems[activeIndex].link} target="_blank" rel="noopener noreferrer">Read more
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="-5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                {/* Asset Swiper using assets array */}
                <div className="asset-swiper">
                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onInit={(swiper: SwiperClass) => {
                      swiperRef.current = swiper;
                    }}
                  >
                    {(safeItems[activeIndex].assets || []).map((asset, idx) => (
                      <SwiperSlide key={idx}>
                        {asset.type === 'image' ? (
                          <img className="bottle-bg" src={asset.src} alt="" style={{ width: '100%', height: 'auto' }} />
                        ) : asset.type === 'video' ? (
                          // Use react-youtube for YouTube videos, fallback to iframe for others
                          asset.src.includes('youtube.com') || asset.src.includes('youtu.be') ? (
                            <YouTube
                              className="video"
                              videoId={getYouTubeId(asset.src)}
                              opts={{ width: '100%', height: '320' }}
                            />
                          ) : (
                            <iframe className='video'
                                    title='Video player'
                                    sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                                    src={asset.src} width="100%" height="320">
                            </iframe>
                          )
                        ) : null}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

// Helper to extract YouTube video ID from URL
function getYouTubeId(url: string): string | undefined {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : undefined;
}

export default ImpactSwiper;