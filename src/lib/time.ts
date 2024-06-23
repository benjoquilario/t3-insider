import dayjs from "dayjs"
import updateLocale from "dayjs/plugin/updateLocale"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mon",
    MM: "%dmon",
    y: "1yr",
    yy: "%dyr",
  },
})

export default dayjs
