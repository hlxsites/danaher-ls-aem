/*
Here we can link the transformer functions
and apply them to specific elements or custom tags
using selectors
*/

import ArticleCard from "../handler/articleCard";
import ArticleCards from "../handler/articleCards";
import AttributesRemover from "../handler/attributesRemover";
import Footer from "../handler/footer";
import FullLayout from "../handler/fullLayout";
import HeroVideo from "../handler/heroVideo";
import LogoCloud from "../handler/logo-cloud";
import RemoveInner from "../handler/removeInner";
import RemoveNewline from "../handler/removeNewline";
import RemoveOuterTag from "../handler/removeOuterTag";
import Remover from "../handler/remover";
import Section from "../handler/section";
import Wesee from "../handler/wesee";

export default {
    mapping: {
        "*": RemoveNewline,
        "head": RemoveInner,
        "body": AttributesRemover,
        "script": Remover,
        "header": RemoveInner,
        "logo-cloud": LogoCloud,
        ".footer.experiencefragment": Footer,
        ".cloudservice.testandtarget": Remover,
        ".logo-cloud": RemoveOuterTag,
        "herovideoplayer": HeroVideo,
        ".articlecard": RemoveOuterTag,
        "articlecard": ArticleCard,
        ".aem-GridColumn--default--12": Section,
        "grid": ArticleCards,
        ".grid": RemoveOuterTag,
        ".aem-Grid": RemoveOuterTag,
        "fulllayout": FullLayout,
        ".root.responsivegrid": RemoveOuterTag,
        "#danaher": RemoveOuterTag,
        "wesee": Wesee
    }
};