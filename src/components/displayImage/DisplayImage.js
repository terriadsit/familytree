import './DisplayImage.css' 

export default function DisplayImage({ src }) {
  return (
    <div className="image">
        <img src={src} alt="person image" />
    </div>
  )
}
