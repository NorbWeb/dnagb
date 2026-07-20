**Title**: 001: Anpassen der Url von Bildern im Block-Editor.

**Created By**: Norbert Madauß

**Date**: 17.07.2026

**Decision Maker**: Norbert Madauß

**Stakeholders**: none

**Status**: Accepted

**Context**: Die hinterlegte CMS-Url für directus sieht so aus: `https://dnagb.de/directus`. Das passt für fast alle Anwendungsbereiche, für den Inhalte von Directus per fetch geholt werden. Üblicherweise wird dann nur noch ein spezifischer Ablageort innerhalb von Directus als url für die Inhalte ausgeliefert (`/assets/items/uuid`). Nicht so bei den Bildern des Block-Editors. Dort wird vorne an noch ein `/directus` mit ausgeliefret, weswegen es zu einer Dopplung des Parameters mit der CMS-Url kommt und das Bild nicht geladen wird. Dies betrifft nicht die lokale Entwicklung.

**Decision**: Da die CMS-Url eine in Apache gesteuerte und Hinterlegte Information ist und sich ggf. ändern kann, soll die im Code hinterlegte CMS-Url nicht verändert werden. Sonst hätte an jeder Stelle, wo diese verwendet wird, die Url zum fetch um den Parameter `/directus` ergänzt werden müssen.  
Um das Problem mit dem Bildern im Block-Editor zu beheben, wird die ausgelieferte Url des file angepasst, sprich der vorangestellte Teil mit `/directus` wird entfernt.

**Consequences**: Es kann sein das das ein Bug im Block-Editor ist und bei zukünftigen Updates von Directus behoben wird. Dann wäre ein zurücknehmen der Url-Anpassung notwendig, damit die Bilder angezeigt werden.  
Es kann sein, dass dieser Fehler noch bei anderen Elementen des Block-Editors auftritt, wobei dieses bisher nicht beobachtet wurde. Es wurden aber noch nicht alle Elemente des Editors in Directus freigeschaltet und im Frontend unterstützt.  
Vielleicht sollte die CMS-Url generell verändert werden und nicht mehr den Parameter `/directus` beinhalten. Der Fehler hätte sich damit erledigt.
