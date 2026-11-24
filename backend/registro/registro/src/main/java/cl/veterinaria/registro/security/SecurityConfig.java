package cl.veterinaria.registro.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/usuarios/registro",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/mascotas", "/api/mascotas/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/adopciones")
                        .authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/adopciones", "/api/adopciones/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/adopciones/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/formulario-contacto")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/formulario-contacto/mis-mensajes")
                        .authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/formulario-contacto")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/formulario-contacto/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/mascotas-registradas")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/mascotas-registradas/mis-mascotas")
                        .authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/mascotas-registradas")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/mascotas-registradas/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/usuarios", "/api/usuarios/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**")
                        .hasAnyRole("OFICINISTA", "ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}