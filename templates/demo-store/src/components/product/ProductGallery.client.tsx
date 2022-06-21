import {MediaFile} from '@shopify/hydrogen/client';
import type {MediaEdge} from '@shopify/hydrogen/storefront-api-types';
import {ATTR_LOADING_EAGER} from '~/lib/const';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaEdge['node'][];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      {media.map((med, i) => {
        let extraProps: Record<string, any> = {};
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: ATTR_LOADING_EAGER,
            disableZoom: true,
          };
        }

        const data = {
          ...med,
          image: {
            // @ts-ignore
            ...med.image,
            altText: med.alt || 'Product image',
          },
        };

        if (i === 0 && med.mediaContentType === 'IMAGE') {
          extraProps.loading = ATTR_LOADING_EAGER;
        }

        const style = [
          isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
          isFirst || isFourth ? '' : 'md:aspect-[4/5]',
          'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
        ].join(' ');

        return (
          <div
            className={style}
            // @ts-ignore
            key={med.id || med.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square fadeIn object-cover`}
              data={data}
              width={med.mediaContentType === 'IMAGE' && 800}
              widths={[400, 800, 1200, 1600, 2000, 2400]}
              sizes={
                isFullWidth
                  ? '(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw'
                  : '(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw'
              }
              // @ts-ignore
              options={{
                crop: 'center',
              }}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}