import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    // Se o token existir e for válido, "grampeia" ele na requisição
    if (token && token !== 'null' && token !== 'undefined') {
        const reqClonada = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(reqClonada);
    }
    return next(req);
};