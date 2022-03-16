import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RegisterBusinessService {

  constructor(private db: AngularFirestore) { };
  private basePath = '/images';

  createProvider(provider: Object) {
    const providerData = JSON.parse(JSON.stringify(provider));
    return {data: this.db.collection('Provider').add(providerData), status: true};
  }

  getAllProviders(): Observable<any> {
    const Providers = this.db.collection<Object>('Provider').snapshotChanges().pipe(map(actions => {
      return actions.map(c => ({
        providerId: c.payload.doc.id,
        ...c.payload.doc.data() as Object
      }));
    }));
    return Providers;
  }

  getProviderById(id: string): Observable<any> {
    const Provider = this.db.doc<Object>('Provider/' + id).valueChanges();
    return Provider;
  }

  deleteProvider(providerId: string) {
    return this.db.doc('Provider/' + providerId).delete();
  }
}
