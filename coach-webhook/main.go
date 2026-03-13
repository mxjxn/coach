package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

// WebhookPayload represents the incoming webhook request
type WebhookPayload struct {
	URL     string                 `json:"url"`
	Message map[string]interface{} `json:"message"`
}

// Response represents the server response
type Response struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

var (
	requestCount int
)

func main() {
	// Configure server
	server := &http.Server{
		Addr:         ":8081",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Setup routes
	http.HandleFunc("/", handleRoot)
	http.HandleFunc("/webhook", handleWebhook)
	http.HandleFunc("/health", handleHealth)

	// Start server
	log.Printf("🚀 Coach Webhook Server starting on http://0.0.0.0:8080")
	log.Printf("📡 Webhook endpoint: http://0.0.0.0:8080/webhook")
	log.Printf("❤️  Health check: http://0.0.0.0:8080/health")

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	response := Response{
		Status:  "ok",
		Message: "Coach Webhook Server - POST to /webhook",
	}
	respondJSON(w, http.StatusOK, response)
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
	requestCount++

	// Only accept POST requests
	if r.Method != http.MethodPost {
		respondError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Parse JSON body
	var payload WebhookPayload
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&payload); err != nil {
		log.Printf("❌ Request #%d - Failed to decode JSON: %v", requestCount, err)
		respondError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}
	defer r.Body.Close()

	// Log the incoming request
	log.Printf("📨 Request #%d - Webhook received", requestCount)
	log.Printf("   URL: %s", payload.URL)
	log.Printf("   Message: %+v", payload.Message)

	// Parse message type and route to appropriate handler
	if err := routeWebhook(payload); err != nil {
		log.Printf("❌ Request #%d - Error processing webhook: %v", requestCount, err)
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Respond with success
	response := Response{
		Status:  "success",
		Message: "Webhook processed successfully",
	}
	respondJSON(w, http.StatusOK, response)
}

func routeWebhook(payload WebhookPayload) error {
	// Check if this is a callback query (button press)
	if callbackData, ok := payload.Message["callback_query"].(string); ok {
		return handleCallbackQuery(callbackData, payload)
	}

	// Check if this is an inline query
	if inlineQuery, ok := payload.Message["inline_query"].(map[string]interface{}); ok {
		return handleInlineQuery(inlineQuery, payload)
	}

	// Check if this is a regular message update
	if message, ok := payload.Message["message"].(map[string]interface{}); ok {
		return handleMessage(message, payload)
	}

	// Unknown message type
	log.Printf("⚠️  Unknown message type in payload")
	return nil
}

func handleMessage(message map[string]interface{}, payload WebhookPayload) error {
	log.Printf("📝 Regular message received")

	// Check for /coach command
	if text, ok := message["text"].(string); ok && text == "/coach" {
		log.Printf("🎯 /coach command detected - showing inline menu")
		return handleCoachCommand(payload)
	}

	// Log message text if present
	if text, ok := message["text"].(string); ok {
		log.Printf("   Message text: %s", text)
	}

	return nil
}

func handleCallbackQuery(callbackData string, payload WebhookPayload) error {
	log.Printf("🔘 Button callback received: %s", callbackData)

	// Handle different button actions
	switch callbackData {
	case "start_coach":
		log.Printf("   Action: Start Coach flow")
	case "view_goals":
		log.Printf("   Action: View goals")
	case "add_goal":
		log.Printf("   Action: Add new goal")
	case "view_tasks":
		log.Printf("   Action: View tasks")
	case "add_task":
		log.Printf("   Action: Add new task")
	default:
		log.Printf("   Unknown callback: %s", callbackData)
	}

	return nil
}

func handleInlineQuery(inlineQuery map[string]interface{}, payload WebhookPayload) error {
	log.Printf("🔍 Inline query received: %+v", inlineQuery)
	return nil
}

func handleCoachCommand(payload WebhookPayload) error {
	log.Printf("🎯 Triggering /coach inline menu")

	// In a real implementation, this would send a message with inline buttons
	// For now, we just log the action

	return nil
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"status":  "healthy",
		"service": "Coach Webhook Server",
		"version": "1.0.0",
		"uptime":  time.Since(time.Now()).String(),
		"requests": requestCount,
	}
	respondJSON(w, http.StatusOK, response)
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}

func respondError(w http.ResponseWriter, status int, message string) {
	response := map[string]interface{}{
		"status":  "error",
		"message": message,
	}
	respondJSON(w, status, response)
}
