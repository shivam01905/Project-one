import type { ConditionCue } from "./types";

/** Default thrift condition-talk cues for a lot */
export function defaultConditionCues(partial?: {
  seams?: boolean;
  fade?: boolean;
  tags?: boolean;
  odor?: boolean;
  sizeFit?: boolean;
}): ConditionCue[] {
  const p = {
    seams: true,
    fade: true,
    tags: true,
    odor: true,
    sizeFit: true,
    ...partial,
  };
  return [
    {
      id: "seams",
      label: "Seams & stitches",
      labelHi: "सीम / सिलाई",
      checked: p.seams,
    },
    {
      id: "fade",
      label: "Fade / wear spots",
      labelHi: "फेड / घिसाव",
      checked: p.fade,
    },
    {
      id: "tags",
      label: "Tags & labels intact",
      labelHi: "टैग सही",
      checked: p.tags,
    },
    {
      id: "odor",
      label: "No smell / clean",
      labelHi: "गंध नहीं",
      checked: p.odor,
    },
    {
      id: "size",
      label: "Size called on camera",
      labelHi: "साइज़ दिखाया",
      checked: p.sizeFit,
    },
  ];
}
