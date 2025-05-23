import {db} from './firebaseConfig'
import {doc, deleteDoc} from 'firebase/firestore'

const borrarProyecto = async(id) => {
    await deleteDoc(doc(db, 'proyectos', id))
}

export default borrarProyecto;