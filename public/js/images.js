/* ==========================================================================
   MAXMET – IMAGE CONFIG
   --------------------------------------------------------------------------
   Every photo on the site is defined here. To swap a photo, change ONE `src`.

   - `src` can be a full URL or a local path, e.g. "img/hero.jpg".
     Unsplash URLs are given without query params; the site adds sizes itself.
   - `alt` is written in all three languages (sv / fi / en).
   - `position` (optional) is the CSS object-position used when the photo is
     cropped to its frame, e.g. "50% 30%" to keep the top part visible.
   - Every frame has a fixed aspect ratio and uses object-fit: cover, so any
     size or orientation works (phone photos too).
   - The gallery adapts to any number of entries: add or remove lines freely.

   Search for "TEMP" to find every temporary stock photo that should be
   replaced with the client's own photos.
   ========================================================================== */

window.MAXMET_IMAGES = {
  hero: {
    // TEMP – Unsplash stock photo
    src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1",
    position: "65% 55%",
    alt: {
      sv: "Svetsare i skyddshjälm svetsar, gnistor yr i verkstaden",
      fi: "Hitsaaja suojakypärässä hitsaa, kipinät lentävät pajalla",
      en: "Welder in a protective helmet at work, sparks flying in the workshop"
    }
  },

  about: {
    // TEMP – Unsplash stock photo
    src: "https://images.unsplash.com/photo-1683470157212-cd4005549fce",
    alt: {
      sv: "Svetsare arbetar på en stålkonstruktion i verkstaden",
      fi: "Hitsaaja työstää teräsrakennetta pajalla",
      en: "Welder working on a steel frame in the workshop"
    }
  },

  services: {
    custom: {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1769152683420-f4eff91cb30b",
      alt: {
        sv: "Specialtillverkade metalldelar på en ritning",
        fi: "Mittatilauksena valmistettuja metalliosia piirustuksen päällä",
        en: "Custom-made metal parts on a technical drawing"
      }
    },
    welding: {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1455165814004-1126a7199f9b",
      alt: {
        sv: "Närbild på svetsning med gnistor",
        fi: "Lähikuva hitsauksesta ja kipinöistä",
        en: "Close-up of welding with sparks"
      }
    },
    sheet: {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1738162837340-da3e7a323a09",
      alt: {
        sv: "Plåt bockas i en kantpress",
        fi: "Ohutlevyä särmätään särmäyspuristimella",
        en: "Sheet metal being bent in a press brake"
      }
    },
    railings: {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1618446911412-e93bd7f24bf5",
      alt: {
        sv: "Ståltrappa med räcken",
        fi: "Teräsportaat kaiteineen",
        en: "Steel staircase with railings"
      }
    },
    repairs: {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1564182998523-6923112e7d6b",
      alt: {
        sv: "Vinkelslip bearbetar en stålbalk",
        fi: "Kulmahiomakone työstää teräspalkkia",
        en: "Angle grinder working on a steel beam"
      }
    },
    batch: {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1701788607416-f1b5dd5a09ec",
      alt: {
        sv: "Serie av perforerade metallvinklar",
        fi: "Sarja rei'itettyjä metallikulmia",
        en: "Batch of perforated metal brackets"
      }
    }
  },

  gallery: [
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1698664683348-f9f35b809821",
      alt: {
        sv: "Svetsning av en stålprofil",
        fi: "Teräsprofiilin hitsausta",
        en: "Welding a steel profile"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1735494033576-9c882e80504c",
      alt: {
        sv: "Laserskärning av stålplåt",
        fi: "Teräslevyn laserleikkausta",
        en: "Laser cutting a steel sheet"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1599336840830-b80b7f9ade79",
      alt: {
        sv: "Trappa med räcken i rostfritt stål",
        fi: "Portaikko ruostumattomin teräskaitein",
        en: "Staircase with stainless steel railings"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1562052579-b30d05e1ec93",
      alt: {
        sv: "Borrning i en metallstång",
        fi: "Metallitangon poraus",
        en: "Drilling a metal bar"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1683470157197-ee1eb03d67cc",
      alt: {
        sv: "TIG-svetsning på nära håll",
        fi: "TIG-hitsausta lähikuvassa",
        en: "TIG welding up close"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1548683726-203119be6a39",
      alt: {
        sv: "Färdiga metallflänsar i rad",
        fi: "Valmiita metallilaippoja riveissä",
        en: "Finished metal flanges in rows"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
      alt: {
        sv: "Slipning av metall med gnistor",
        fi: "Metallin hiontaa, kipinöitä",
        en: "Grinding metal with sparks"
      }
    },
    {
      // TEMP – Unsplash stock photo
      src: "https://images.unsplash.com/photo-1697698532634-ea59b636ccea",
      alt: {
        sv: "Stålrullar i ett lager",
        fi: "Teräskeloja varastossa",
        en: "Steel coils in a warehouse"
      }
    }
  ]
};
