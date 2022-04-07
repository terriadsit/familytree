
export default function checkImage(selected) {
    let error = null
    if (selected) {
        if (!selected.type.includes('image')) {
          error = 'selected file must be an image'
        }
        if (selected.size > 100000) {
          error = 'selected file must be smaller than 100kb'
        }
    }
        return error
}
